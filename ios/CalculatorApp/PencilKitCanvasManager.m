#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PencilKitCanvasManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(drawingData, NSString)
RCT_EXPORT_VIEW_PROPERTY(onDrawingChange, RCTDirectEventBlock)

@end
