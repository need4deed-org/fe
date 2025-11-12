import React from 'react'
import { ComponentContainer } from './ComponentContainer'
import { ApiVolunteerGet } from 'need4deed-sdk';

type PresentationalComponentProps = {
  volunteer: ApiVolunteerGet;
};

const Activities = ({volunteer} : PresentationalComponentProps) => {
  return (
    <ComponentContainer>Activities</ComponentContainer>
  )
}

export default Activities