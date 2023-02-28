import React from "react";
import JsBarcode from "jsbarcode";

export const BarcodeView = (props: { value: string }) => {
  const ref = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    try {
      if (ref.current) {
        let code = JsBarcode(ref.current).options({
          font: "OCR-B",
          fontSize: 12,
          width: 1.5,
          height: 30,
          margin: 0,
        });
        if (props.value.length === 8) {
          code.EAN8(props.value, {});
        } else if (props.value.length === 13) {
          code.EAN13(props.value, {});
        } else {
          code.CODE128(props.value, {});
        }
        code.render();
      }
    } catch (e) {
      window.console.error(e);
    }
  }, [ref, props]);

  return <svg ref={ref} />;
};
