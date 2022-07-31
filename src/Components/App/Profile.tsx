import maybe from "maybe-for-sure";
import { FC } from "react";
import styled from "styled-components";
import { User } from "../../domain";
import { base, ContentBody, shade, Thumb } from "../styled";

export interface Props {
  user: Optional<User>;
}

const HeaderContent = styled(ContentBody)`
  align-items: end;
  position: relative;
  height: calc(${base} * 6);
  img {
    ${shade};
    border-radius: calc(${base} * 5);
  }
`;
const Profile: FC<Props> = ({ user }: Props) => {
  return (
    <HeaderContent>
      {maybe(user)
        .mapTo("avatar_url")
        .map((src) => <Thumb {...{ src }} />)
        .valueOr(<></>)}
    </HeaderContent>
  );
};
export default Profile;
