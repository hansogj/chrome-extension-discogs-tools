import maybe from "maybe-for-sure";
import React, { FC, PropsWithChildren } from "react";
import { ReleasePageItem } from "../../../domain";
import { BrightCard, ContentBody } from "../../styled";
import ListItem from "./ListPageItem";

export interface Props {
  releasePageItem: ReleasePageItem;
}

const WithReleasePageItem: FC<PropsWithChildren<Props>> = ({
  releasePageItem,
  children,
}: PropsWithChildren<Props>) => (
  <ContentBody filled>
    <BrightCard>
      {maybe(releasePageItem)
        .mapTo("master")
        .map((releasePageItem) => <ListItem {...{ releasePageItem }} />)
        .valueOr(<></>)}
    </BrightCard>
    {children}
  </ContentBody>
);

export default WithReleasePageItem;
