import React

@objc(PencilKitCanvasManager)
final class PencilKitCanvasManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func view() -> UIView! {
    PencilKitCanvasView()
  }
}
