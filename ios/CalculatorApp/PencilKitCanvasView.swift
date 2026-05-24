import PencilKit
import React
import UIKit

@objc(PencilKitCanvasView)
final class PencilKitCanvasView: UIView, PKCanvasViewDelegate {
  private let canvasView = PKCanvasView()
  private var toolPicker: PKToolPicker?
  private var lastDrawingData: String?
  private var hasWindow = false
  private var wantsToolPickerVisible = true

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
      updateDrawingAvailability()
    }
  }

  @objc var toolPickerVisible: Bool = true {
    didSet {
      wantsToolPickerVisible = toolPickerVisible
      updateToolPickerVisibility()
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
    updateDrawingAvailability()
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

  private func updateDrawingAvailability() {
    canvasView.drawingPolicy = drawingEnabled ? .anyInput : .pencilOnly
    canvasView.drawingGestureRecognizer.isEnabled = drawingEnabled
    canvasView.isUserInteractionEnabled = drawingEnabled
  }
}
