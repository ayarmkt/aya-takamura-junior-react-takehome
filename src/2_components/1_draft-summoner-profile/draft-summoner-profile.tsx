import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { useResource } from '../../1_hooks/resource.provider';
import { Card, Typography } from '../../common/core/components';
import { Client, isChampionIdValid, isRoleValid } from '../../common/league';

// https://v4.mui.com/styles/api/#examples-2
const useStyles = makeStyles((theme) => ({
  root: {},
}));

export interface Profile {
  gamesPlayed: number;
  winrate: number;
  kda: number;
}

export interface DraftSummonerProfile {
  summonerName: string;
  gamesPlayed?: number;
  winrate?: number;

  tier?: Client.Tier;
  division?: Client.Division;

  role?: Client.Role;
  roleProfile?: Profile;

  championId?: Client.ChampionId;
  championProfile?: Profile;
}

export interface DraftSummonerProfileProps {
  profile: DraftSummonerProfile;
}

// TODO: Implement this component based on the Figma design. You should use the provided components: Card and Typography.
//       https://www.figma.com/file/0OzXZgcefj9s8aTHnACJld/Junior-React-Takehome?node-id=42%3A43
// Notes:
// - It has multiple states, each are represented as separate story in storybook
// - Use the profile data to dynamically determine what state to show
// - A profile is available if gamesPlayed is > 0
// - If winrate is >= 50, it's positive and displayed in our primary color, otherwise is negative and displayed in text primary

export const DraftSummonerProfile: React.FC<DraftSummonerProfileProps> = ({
  profile: {
    summonerName,
    winrate,
    gamesPlayed,

    tier,
    division,

    role,
    roleProfile,

    championId,
    championProfile,
  },
}) => {
  const classes = useStyles();

  const {
    getChampionName,
    getChampionImage,
    getRoleName,
    getTierDivisionName,
  } = useResource();

  const hasRole = isRoleValid(role);
  const hasChampion = isChampionIdValid(championId);

  return (
    <Card
      elevation='1'
      p={1}
      style={{ display: 'flex', flexDirection: 'row', padding: 8 }}
    >
      {championId && <img src={getChampionImage(championId)} alt='champion' />}
      <Card width='80px'>
        <Typography className='subtitle2'>{summonerName}</Typography>
        <Typography>{winrate && `${winrate}% wr`}</Typography>
        <Typography>{tier && division && `${tier}${division}`}</Typography>
        <Typography>{gamesPlayed && `${gamesPlayed} games`}</Typography>
        {!roleProfile && <Typography>No data</Typography>}
      </Card>

      <Card width='80px'>
        <Typography>
          {role && (championId ? `on Ekko` : `as ${getRoleName(role)}`)}
        </Typography>
        {roleProfile && (
          <React.Fragment>
            <Typography>
              {championProfile
                ? `${championProfile.winrate}% wr`
                : `${roleProfile.winrate}% wr`}
            </Typography>
            <Typography> {`${roleProfile.kda}kda`}</Typography>
            <Typography>
              {championProfile
                ? `${championProfile.gamesPlayed} games`
                : `${roleProfile.gamesPlayed} games`}
            </Typography>
          </React.Fragment>
        )}
        {role && !championProfile && <Typography>No data</Typography>}
      </Card>
    </Card>
  );
};
