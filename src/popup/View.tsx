import { View } from '../services/redux/app';
import AddToFolder from './Discogs/AddToFolder';
import Artist from './Discogs/Artist';
import WantList from './Discogs/WantList';
import { ContentBody } from './styled';

import Settings from './Settings';

export interface Props {
  activeView: View;
}

const DiscogsContainer = ({ activeView }: Props) => (
  <ContentBody>
    {activeView === 'Want List' && <WantList />}
    {activeView === 'Item' && <AddToFolder />}
    {activeView === 'Artist' && <Artist />}
    {activeView === 'Settings' && <Settings />}
  </ContentBody>
);

export default DiscogsContainer;
