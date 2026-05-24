import PencilKit
import React
import UIKit

@objc(PencilKitCanvasView)
final class PencilKitCanvasView: UIView, PKCanvasViewDelegate {
  private let canvasView = PKCanvasView()
  private lazy var navigationPanGesture = UIPanGestureRecognizer(
    target: self,
    action: #selector(handleNavigationPan(_:)),
  )
  private lazy var navigationPinchGesture = UIPinchGestureRecognizer(
    target: self,
    action: #selector(handleNavigationPinch(_:)),
  )
  private var toolPicker: PKToolPicker?
  private var lastDrawingData: String?
  private var hasWindow = false
  private var wantsToolPickerVisible = true
  private var navigationOffset = CGPoint.zero
  private var navigationPanStartOffset = CGPoint.zero
  private var navigationScale: CGFloat = 1
  private var navigationPinchStartScale: CGFloat = 1

  @objc var drawingData: NSString? {
    didSet {
      guard let drawingData = drawingData as String?, drawingData != lastDrawingData else {
        return
      }

      lastDrawingData = drawingData
      guard let data = Data(base64Encoded: drawingData),
            let drawing = try? PKDrawing(data: data) else {
        canvasView.drawing = PKDrawing()
        return
      }

      canvasView.drawing = drawing
    }
  }

  @objc var onDrawingChange: RCTDirectEventBlock?

  @objc var drawingEnabled: Bool = true {
    didSet {
      updateInteractionMode()
    }
  }

  @objc var toolPickerVisible: Bool = true {
    didSet {
      wantsToolPickerVisible = toolPickerVisible
      updateToolPickerVisibility()
    }
  }

  @objc var zoomEnabled: Bool = false {
    didSet {
      updateZoomAvailability()
    }
  }

  @objc var zoomScale: NSNumber = 1 {
    didSet {
      updateZoomScale()
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    configureCanvas()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    configureCanvas()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    canvasView.frame = bounds
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    hasWindow = window != nil
    updateToolPickerVisibility()
  }

  private func configureCanvas() {
    backgroundColor = .clear
    canvasView.backgroundColor = .clear
    canvasView.isOpaque = false
    canvasView.delegate = self
    canvasView.drawingPolicy = .anyInput
    canvasView.minimumZoomScale = 1
    canvasView.maximumZoomScale = 1
    canvasView.alwaysBounceVertical = false
    canvasView.alwaysBounceHorizontal = false
    canvasView.isScrollEnabled = false

    addSubview(canvasView)
    addGestureRecognizer(navigationPanGesture)
    addGestureRecognizer(navigationPinchGesture)
    updateInteractionMode()
    updateZoomAvailability()
  }

  private func updateToolPickerVisibility() {
    guard hasWindow else {
      toolPicker?.setVisible(false, forFirstResponder: canvasView)
      return
    }

    let picker = toolPicker ?? PKToolPicker()
    picker.addObserver(canvasView)
    picker.setVisible(wantsToolPickerVisible, forFirstResponder: canvasView)

    if wantsToolPickerVisible {
      canvasView.becomeFirstResponder()
    } else {
      canvasView.resignFirstResponder()
    }

    toolPicker = picker
  }

  func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
    let encodedDrawing = canvasView.drawing.dataRepresentation().base64EncodedString()
    lastDrawingData = encodedDrawing
    onDrawingChange?(["drawingData": encodedDrawing])
  }

  private func updateZoomAvailability() {
    navigationPanGesture.isEnabled = zoomEnabled && !drawingEnabled
    navigationPinchGesture.isEnabled = zoomEnabled && !drawingEnabled

    if zoomEnabled && !drawingEnabled {
      updateZoomScale()
    } else {
      resetNavigationTransform()
    }
  }

  private func updateZoomScale() {
    guard zoomEnabled else {
      return
    }

    navigationScale = boundedNavigationScale(CGFloat(truncating: zoomScale))
    applyNavigationTransform()
  }

  private func updateInteractionMode() {
    canvasView.drawingPolicy = drawingEnabled ? .anyInput : .pencilOnly
    canvasView.drawingGestureRecognizer.isEnabled = drawingEnabled
    canvasView.isUserInteractionEnabled = drawingEnabled

    navigationPanGesture.isEnabled = !drawingEnabled && zoomEnabled
    navigationPinchGesture.isEnabled = !drawingEnabled && zoomEnabled

    if drawingEnabled {
      resetNavigationTransform()
    }
  }

  private func resetNavigationTransform() {
    navigationScale = 1
    navigationOffset = .zero
    canvasView.transform = .identity
  }

  private func boundedNavigationScale(_ scale: CGFloat) -> CGFloat {
    min(3, max(0.75, scale))
  }

  private func applyNavigationTransform() {
    canvasView.transform = CGAffineTransform(
      translationX: navigationOffset.x,
      y: navigationOffset.y,
    ).scaledBy(x: navigationScale, y: navigationScale)
  }

  @objc private func handleNavigationPan(_ gesture: UIPanGestureRecognizer) {
    guard !drawingEnabled else {
      return
    }

    switch gesture.state {
    case .began:
      navigationPanStartOffset = navigationOffset
    case .changed:
      let translation = gesture.translation(in: self)
      navigationOffset = CGPoint(
        x: navigationPanStartOffset.x + translation.x,
        y: navigationPanStartOffset.y + translation.y,
      )
      applyNavigationTransform()
    default:
      break
    }
  }

  @objc private func handleNavigationPinch(_ gesture: UIPinchGestureRecognizer) {
    guard !drawingEnabled else {
      return
    }

    switch gesture.state {
    case .began:
      navigationPinchStartScale = navigationScale
    case .changed:
      navigationScale = boundedNavigationScale(navigationPinchStartScale * gesture.scale)
      applyNavigationTransform()
    default:
      break
    }
  }
}
