import React from 'react'
import { ComponentContainer } from './ComponentContainer'
import { ApiVolunteerGet } from 'need4deed-sdk';

type PresentationalComponentProps = {
  volunteer: ApiVolunteerGet;
};

const HeaderComponent = ({volunteer} : PresentationalComponentProps) => {
  return (
    <ComponentContainer>HeaderComponent</ComponentContainer>
  )
}

export default HeaderComponent