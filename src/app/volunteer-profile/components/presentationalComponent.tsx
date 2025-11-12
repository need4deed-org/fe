'use client'

import { Header } from '@/components/Header'
import React from 'react'
import HeaderComponent from './HeaderComponent'
import ContactDetails from './ContactDetails'
import VolunteerProfile from './VolunteerProfile'
import Opportunities from './Opportunities'
import Comments from './Comments'
import Documents from './Documents'
import Activities from './Activities'
import styled from 'styled-components'
import { ApiVolunteerGet } from 'need4deed-sdk';

type PresentationalComponentProps = {
  volunteer: ApiVolunteerGet;
};

const GradientBackground = styled.div`
  background: linear-gradient(to bottom, #F6EEE7, #FBE2FF);
  min-height: 100vh;
  width: 100%;
  `;

const Content = styled.div`
  padding: 2rem;
  color: #1A2684;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  `;

const PresentationalComponent = ({volunteer} : PresentationalComponentProps) => {
  return (
    <GradientBackground>
      <Content>
        <h1>Volunteer's profile</h1>
        <HeaderComponent volunteer={volunteer}/>
        <ContactDetails/>
        <VolunteerProfile/>
        <Opportunities/>
        <Comments/>
        <Documents/>
        <Activities volunteer={volunteer}/>
      </Content>
    </GradientBackground>
  )
}

export default PresentationalComponent