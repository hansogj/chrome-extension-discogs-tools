import React, { FC } from "react";
import { Version } from "../../../domain";
import { DispatchAction as DiscogsDispatch } from "../../../redux/store";
import { getText } from "../../../services/texts";
import {
  base,
  BrightCard,
  Button,
  Column,
  DreadButton,
  UglyButton,
  Row,
  Submit,
} from "../../styled";

export interface Props {
  addToWantList: DiscogsDispatch<Optional<Version["format"]>>;
}
const AddWantListComponent: FC<Props> = ({ addToWantList }: Props) => (
  <BrightCard style={{ marginTop: base }}>
    <Row center>
      <h2>{getText("discogs.add.to.wantlinst.title")}</h2>
    </Row>
    <Row center width={42}>
      <Column>
        <Submit onClick={() => addToWantList("Vinyl")}>Vinyl</Submit>
      </Column>
      <Column>
        <Button onClick={() => addToWantList("Cd")}>Cd</Button>
      </Column>
      <Column>
        <UglyButton onClick={() => addToWantList("Casette")}>
          Casette
        </UglyButton>
      </Column>
      <Column>
        <DreadButton
          onClick={() =>
            addToWantList(undefined as Optional<Version["format"]>)
          }
        >
          ALL
        </DreadButton>
      </Column>
    </Row>
  </BrightCard>
);

export default AddWantListComponent;
