import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { useResource } from '../../1_hooks/resource.provider';
import { Card, Typography } from '../../common/core/components';
import { Client, isChampionIdValid, isRoleValid } from '../../common/league';
import NoChampionImage from '../../assets/champion-not-selected.png';

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
  const hasData = gamesPlayed ? true : false;

  const championSrc = hasChampion
    ? getChampionImage(championId)
    : NoChampionImage;

  const displayWinrate = () => {
    if (championProfile) {
      return +championProfile.winrate.toFixed(1);
    } else {
      return +roleProfile.winrate.toFixed(1);
    }
  };

  return (
    <Card
      elevation='5'
      p={1}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <img
        src={championSrc}
        alt='champion'
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '3px',
          alignSelf: 'center',
        }}
      />

      <Card
        elevationOpacity={0}
        p={0}
        style={{
          display: 'flex',
          marginLeft: '8px',
        }}
      >
        <Card width={'88px'} elevationOpacity={0} p={0}>
          <Typography
            className='subtitle2'
            variant='textSmall'
            weight='medium'
            color='textSecondary'
            mt={0.5}
            mb={1}
          >
            {summonerName}
          </Typography>

          {!hasData && (
            <Typography
              variant='textSmall'
              weight='regular'
              color='textSecondary'
            >
              No data
            </Typography>
          )}

          {hasData && (
            <React.Fragment>
              <Typography
                variant='textSmall'
                weight={winrate >= 50 ? 'medium' : 'regular'}
                color={winrate >= 50 ? 'primary' : 'textPrimary'}
                mb={1}
              >
                {`${+winrate.toFixed(1)}% wr`}
              </Typography>
              <Typography
                variant='textExtraSmall'
                weight='regular'
                color='textPrimary'
                mb={1}
              >
                {getTierDivisionName(tier, division)}
              </Typography>
              <Typography
                variant='textExtraSmall'
                weight='regular'
                color='textTertiary'
                mb={0.5}
              >
                {`${gamesPlayed} games`}
              </Typography>
            </React.Fragment>
          )}
        </Card>

        <Card width={'88px'} elevationOpacity={0} p={0}>
          {hasRole && (
            <Typography
              variant='textSmall'
              weight='regular'
              color='textSecondary'
              mt={0.5}
              mb={1}
            >
              {hasChampion
                ? `on ${getChampionName(championId)}`
                : `as ${getRoleName(role)}`}
            </Typography>
          )}

          {hasRole && !hasData && (
            <Typography
              variant='textSmall'
              weight='regular'
              color='textSecondary'
            >
              No data
            </Typography>
          )}

          {hasRole && hasData && (
            <React.Fragment>
              <Typography
                variant='textSmall'
                weight={displayWinrate() >= 50 ? 'medium' : 'regular'}
                color={displayWinrate() >= 50 ? 'primary' : 'textPrimary'}
                mb={1}
              >
                {`${displayWinrate()}% wr`}
              </Typography>
              <Typography
                variant='textExtraSmall'
                weight='regular'
                color='textPrimary'
                mb={1}
              >
                {`${+roleProfile.kda.toFixed(1)}kda`}
              </Typography>
              <Typography
                variant='textExtraSmall'
                weight='regular'
                color='textTertiary'
                mb={0.5}
              >
                {hasChampion
                  ? `${championProfile.gamesPlayed} games`
                  : `${roleProfile.gamesPlayed} games`}
              </Typography>
            </React.Fragment>
          )}
        </Card>
      </Card>
    </Card>
  );
};
