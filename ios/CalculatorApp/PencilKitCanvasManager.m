#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PencilKitCanvasManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(drawingEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(drawingData, NSString)
RCT_EXPORT_VIEW_PROPERTY(onDrawingChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(toolPickerVisible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomScale, NSNumber)

@end
