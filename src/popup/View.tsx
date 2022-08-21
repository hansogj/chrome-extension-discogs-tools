import { View } from '../services/redux/app';
import AddToFolder from './Discogs/AddToFolder';

import WantListComponent from './Discogs/WantList';
import { ContentBody } from './styled';

import Settings from './Settings';

export interface Props {
  activeView: View;
}

const DiscogsContainer = ({ activeView }: Props) => (
  <ContentBody>
    {activeView === 'Want List' && <WantListComponent />}
    {activeView === 'Add Item' && <AddToFolder />}
    {activeView === 'Settings' && <Settings />}
  </ContentBody>
);

export default DiscogsContainer;
