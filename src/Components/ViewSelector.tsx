import { FC } from "react";
import { Collection, Eye, List, Settings } from "../assets/icons";
import { MustHaveReleaseItem, View, Views } from "../redux/app";
import { DispatchAction } from "../redux/store";
import { Button, colors, Column, Row } from "./styled";

const IconMap: Record<View, (fill: string) => JSX.Element> = {
  Watch: (fill: string) => <Eye {...{ fill }} />,
  "Add Item": (fill: string) => <Collection {...{ fill }} />,
  "Want List": (fill: string) => <List {...{ fill }} />,
  Settings: (fill: string) => <Settings {...{ fill }} />,
};

export interface Props {
  activeView: View;
  setView: DispatchAction<View>;
  hasReleasePageItem: boolean;
}

const isDisabled = (view: View, hasReleasePageItem: boolean) =>
  !hasReleasePageItem &&
  MustHaveReleaseItem.map((it) => it.toLowerCase()).includes(
    view.toLowerCase()
  );

const ViewSelector: FC<Props> = ({
  setView,
  activeView,
  hasReleasePageItem,
}: Props) => (
  <Row width={30}>
    {Views.map((view) => (
      <Column key={view} center>
        <Button
          disabled={isDisabled(view, hasReleasePageItem)}
          active={view === activeView}
          onClick={() => {
            setView(view);
          }}
        >
          {IconMap[view](
            view !== activeView ? colors.kindOfBlue : colors.bright
          )}
          {view}
        </Button>
      </Column>
    ))}
  </Row>
);

export default ViewSelector;
