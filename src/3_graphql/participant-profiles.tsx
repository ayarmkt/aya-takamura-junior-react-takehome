import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import { DraftSummonerProfiles } from '../2_components/2_draft-summoner-profiles';
import { Client } from '../common/league';
import {
  ParticipantProfilesQueryData,
  PARTICIPANT_PROFILES_QUERY,
} from './participant-profiles.graphql-queries';
import { GetParticipantProfilesInput } from './participant-profiles.graphql-types';
//import { DraftSummonerProfile } from '../2_components/1_draft-summoner-profile';
//import { ParticipantProfile } from './participant-profiles.graphql-types';

export interface Participant {
  summonerName: string;
  role?: Client.Role;
  championId?: Client.ChampionId;
}

export interface ParticipantProfilesProps {
  platformId: string;
  queueId: string;
  participants: Participant[];
}

export const ParticipantProfiles: React.FC<ParticipantProfilesProps> = ({
  platformId,
  queueId,
  participants,
}) => {
  const input: GetParticipantProfilesInput = useMemo(() => {
    return {
      platformId,
      queueId,
      participants,
    };
  }, [platformId, queueId, participants]);

  // TODO: Finish the GraphQL query PARTICIPANT_PROFILES_QUERY, based on the schema at `participant-profiles.graphql`
  // Bonus points:
  //  - Handle the loading state
  //  - Handle the error state
  // We don't provide a design nor guidelines about how to handle those two states.
  // You are free to handle and implement them based on what you believe works best for those states.
  const { loading, error, data } = useQuery<ParticipantProfilesQueryData>(
    PARTICIPANT_PROFILES_QUERY,
    {
      variables: {
        input,
      },
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred.</div>;
  }

  console.debug(`ParticipantProfilesView_useQuery`, loading, error, data);

  return (
    <DraftSummonerProfiles
      profiles={participants.map((participant) => {
        // TODO: Match the participant with one of the profiles from the query data
        return {
          summonerName: participant.summonerName,
        };
      })}

      // profiles={participants.map((participant) => {
      //   // TODO: Match the participant with one of the profiles from the query data
      //   let match: ParticipantProfile;
      //   data.getParticipantProfiles.map((profile) => {
      //     if (participant.summonerName === profile.summonerName) {
      //       match = { ...match, ...profile };
      //     }
      //   });
      //   return match;
      // })}
    />
  );
};
