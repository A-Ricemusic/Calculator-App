import PencilKit
import React
import UIKit

@objc(PencilKitCanvasView)
final class PencilKitCanvasView: UIView, PKCanvasViewDelegate {
  private let canvasView = PKCanvasView()
  private var toolPicker: PKToolPicker?
  private var lastDrawingData: String?
  private var hasWindow = false

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

    addSubview(canvasView)
  }

  private func updateToolPickerVisibility() {
    guard hasWindow else {
      return
    }

    let picker = PKToolPicker()
    picker.addObserver(canvasView)
    picker.setVisible(true, forFirstResponder: canvasView)
    canvasView.becomeFirstResponder()
    toolPicker = picker
  }

  func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
    let encodedDrawing = canvasView.drawing.dataRepresentation().base64EncodedString()
    lastDrawingData = encodedDrawing
    onDrawingChange?(["drawingData": encodedDrawing])
  }
}
