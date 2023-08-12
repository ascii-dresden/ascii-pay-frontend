import QRCode from "qrcode.react";
import styled from "@emotion/styled";

const StyledAdditionalInformation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledAdditionalInformationQR = styled.div`
  position: relative;
  background-color: #eeeeee;
  padding: 1em;
  width: 12em;
  height: 12em;
  margin-right: 2em;
`;
const StyledAdditionalInformationText = styled.div`
  width: 18em;
  text-align: center;
  margin-right: 1em;
`;
const StyledAdditionalInformationUrl = styled.div`
  position: absolute;
  bottom: 0.5em;
  left: 0;
  right: 3em;
  text-align: center;
  font-size: 0.8em;
`;

export const AdditionalInformation = () => {
  const url =
    "https://wiki.ascii.coffee/books/anleitungen-getting-started/page/letzte-schicht-des-tages";
  return (
    <StyledAdditionalInformation>
      <StyledAdditionalInformationText>
        Mehr Informationen zur letzte Schicht des Tages sind im Wiki zu finden:
      </StyledAdditionalInformationText>
      <StyledAdditionalInformationQR>
        <QRCode
          size={256}
          style={{ height: "100%", width: "100%" }}
          viewBox={`0 0 256 256`}
          bgColor="#eeeeee"
          fgColor="#333333"
          value={url}
        />
      </StyledAdditionalInformationQR>
      <StyledAdditionalInformationUrl>{url}</StyledAdditionalInformationUrl>
    </StyledAdditionalInformation>
  );
};
