import React from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Cancel, Refresh } from "@mui/icons-material";
import styled from "@emotion/styled";
import { CoinAmountView } from "../../components/transaction/CoinAmountView";
import { removeAccount } from "../../redux/features/paymentSlice";

const StyledScannedAccount = styled.div`
  position: relative;
  height: 4.4rem;
  line-height: 4.4rem;
  text-align: center;

  background-color: var(--secondary-hover-background);
  border-bottom: solid 1px var(--border-color);
  border-left: solid 1px var(--border-color);
`;
const StyledScannedAccountName = styled.div`
  line-height: 1.4rem;
  text-align: left;
  padding: 0.8rem 1rem 0.4rem;
  font-weight: bold;
`;
const StyledScannedAccountTags = styled.div`
  display: flex;
  line-height: 1rem;
  padding-left: 1rem;

  div {
    display: flex;
    justify-content: center;
    margin-left: 1rem;
  }
`;
const StyledScannedAccountRemove = styled.div`
  svg {
    position: absolute;
    top: 50%;
    margin-top: -0.6rem;
    right: 1rem;

    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledScannedAccountEmpty = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > span {
    display: block;
    padding-left: 2rem;
  }
`;
const StyledScannedAccountRefresh = styled.div`
  width: 4.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

export const ScannedAccount = () => {
  const { t } = useTranslation();
  const scannedAccount = useAppSelector(
    (state) => state.paymentState.scannedAccount
  );
  const dispatch = useAppDispatch();

  if (scannedAccount === null) {
    return (
      <StyledScannedAccount>
        <StyledScannedAccountEmpty>
          <span>{t("payment.noAccount")}</span>
          <StyledScannedAccountRefresh>
            <Refresh />
          </StyledScannedAccountRefresh>
        </StyledScannedAccountEmpty>
      </StyledScannedAccount>
    );
  }

  return (
    <StyledScannedAccount>
      <StyledScannedAccountName>{scannedAccount.name}</StyledScannedAccountName>
      <StyledScannedAccountTags>
        <CoinAmountView coins={scannedAccount.balance} negativeIsError={true} />
      </StyledScannedAccountTags>
      <StyledScannedAccountRemove onClick={() => dispatch(removeAccount())}>
        <Cancel />
      </StyledScannedAccountRemove>
    </StyledScannedAccount>
  );
};
