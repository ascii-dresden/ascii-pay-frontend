import React from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { getRegisterTotal } from "../../../common/registerHistoryUtils";
import { moneyToString } from "../../../terminalApp/components/Money";

const StyledEnvelope = styled.div`
  position: relative;
  width: 54em;

  .cash-book {
    display: block;
    width: 100%;
    height: 5em;
    padding: 1.1em;
    margin-top: 2em;

    & > span {
      display: block;
      font-weight: bold;
      padding-bottom: 0.4em;
    }

    .cash-book-list {
      display: flex;

      span {
        flex-grow: 1;
        border-left: solid 1px var(--border-color);
        text-align: center;

        &:first-of-type {
          border-left: none;
        }

        &:nth-of-type(5) {
          border-left: solid 2px var(--secondary-text-color);
        }
      }
    }
  }

  .envelope-columns {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 0.4em;
    margin-top: 3em;
    margin-left: 3em;

    span.secondary {
      color: var(--secondary-text-color);
    }

    & > div {
      & > span {
        display: block;
        font-weight: bold;
        padding-bottom: 0.4em;
        width: 4em;
        text-align: right;
      }

      & > div {
        & > div {
          position: relative;
          padding: 0.2em 0;

          span {
            display: inline-block;

            &:first-of-type {
              width: 4em;
              text-align: right;
            }

            &:last-of-type {
              padding-left: 1em;
            }
          }
        }
      }

      &:not(:first-of-type) {
        & > span {
          width: 5em;
        }

        & > div span:first-of-type {
          width: 5em;
        }

        & > div span:last-of-type {
          position: relative;
          margin-left: 0.9em;
          width: 2em;
          text-align: center;

          &::before {
            content: "✕";
            font-size: 0.6em;
            position: absolute;
            left: 0;
            top: 0.2em;
          }
        }
      }
    }
  }
`;

export const Envelope = () => {
  const { t } = useTranslation();

  const coinBox = useDashboardSelector((state) => state.registerState.coinBox);
  const noteBox = useDashboardSelector((state) => state.registerState.noteBox);
  const previousCoinBox = useDashboardSelector(
    (state) => state.registerState.previous?.coinBox
  );
  const previousNoteBox = useDashboardSelector(
    (state) => state.registerState.previous?.noteBox
  );

  if (!previousCoinBox || !previousNoteBox) {
    return null;
  }

  const currentTotal = getRegisterTotal(coinBox, noteBox);
  const previousTotal = getRegisterTotal(previousCoinBox, previousNoteBox);

  const today = new Date();
  const date = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;

  return (
    <StyledEnvelope>
      <div className="cash-book">
        <span>{t("register.cashBook")}</span>
        <div className="cash-book-list">
          <span>{moneyToString(previousTotal)}</span>
          <span>{moneyToString(previousTotal - currentTotal)}</span>
          <span>{moneyToString(currentTotal)}</span>
          <span>-</span>
          <span>{date}</span>
          <span>{previousNoteBox.note100}</span>
          <span>{previousNoteBox.note50}</span>
          <span>{previousNoteBox.note20}</span>
          <span>{previousNoteBox.note10}</span>
          <span>{previousNoteBox.note5}</span>
          <span>{previousCoinBox.coin200}</span>
          <span>{previousCoinBox.coin100}</span>
          <span>{previousCoinBox.coin50}</span>
          <span>{previousCoinBox.coin20}</span>
          <span>{previousCoinBox.coin10}</span>
          <span>{previousCoinBox.coin5}</span>
          <span>{previousCoinBox.coin2}</span>
          <span>{previousCoinBox.coin1}</span>
          <span>{moneyToString(previousTotal)}</span>
        </div>
      </div>

      <div className="envelope-columns">
        <div>
          <span>{t("register.envelope")}</span>
          <div>
            <div>
              <span>{t("register.name")}</span>
              <span className="secondary">{t("register.yourName")}</span>
            </div>
            <div>
              <span>{t("register.date")}</span>
              <span>{date}</span>
            </div>
            <div>
              <span>{t("register.total")}</span>
              <span>{moneyToString(previousTotal - currentTotal)}</span>
            </div>
          </div>
        </div>

        <div>
          <span>{t("register.coins")}</span>
          <div>
            <div>
              <span>2 EURO</span>
              <span>{previousCoinBox.coin200 - coinBox.coin200}</span>
            </div>
            <div>
              <span>1 EURO</span>
              <span>{previousCoinBox.coin100 - coinBox.coin100}</span>
            </div>
            <div>
              <span>50 CENT</span>
              <span>{previousCoinBox.coin50 - coinBox.coin50}</span>
            </div>
            <div>
              <span>20 CENT</span>
              <span>{previousCoinBox.coin20 - coinBox.coin20}</span>
            </div>
            <div>
              <span>10 CENT</span>
              <span>{previousCoinBox.coin10 - coinBox.coin10}</span>
            </div>
            <div>
              <span>5 CENT</span>
              <span>{previousCoinBox.coin5 - coinBox.coin5}</span>
            </div>
            <div>
              <span>2 CENT</span>
              <span>{previousCoinBox.coin2 - coinBox.coin2}</span>
            </div>
            <div>
              <span>1 CENT</span>
              <span>{previousCoinBox.coin1 - coinBox.coin1}</span>
            </div>
          </div>
        </div>

        <div>
          <span>{t("register.notes")}</span>
          <div>
            <div>
              <span>100 EURO</span>
              <span>{previousNoteBox.note100 - noteBox.note100}</span>
            </div>
            <div>
              <span>50 EURO</span>
              <span>{previousNoteBox.note50 - noteBox.note50}</span>
            </div>
            <div>
              <span>20 EURO</span>
              <span>{previousNoteBox.note20 - noteBox.note20}</span>
            </div>
            <div>
              <span>10 EURO</span>
              <span>{previousNoteBox.note10 - noteBox.note10}</span>
            </div>
            <div>
              <span>5 EURO</span>
              <span>{previousNoteBox.note5 - noteBox.note5}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledEnvelope>
  );
};
