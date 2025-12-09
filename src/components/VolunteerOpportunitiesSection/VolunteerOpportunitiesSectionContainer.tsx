'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import OpportunitiesList from './OpportunitiesList'
import useVolunteerOpportunities from './useVolunteerOpportinities'

const WrapContainer = styled.div`
width: var(--opportunitiesSectionContainer-wrapContainer-width);
padding: var(--opportunitiesSectionContainer-wrapContainer-padding);
display: var(--opportunitiesSectionContainer-wrapContainer-display);
flex-direction: var(--opportunitiesSectionContainer-wrapContainer-flexDirection);
gap: var(--opportunitiesSectionContainer-wrapContainer-gap);
color: var(--color-midnight);
background-color: var(--color-white);
border-radius: var(--opportunitiesSectionContainer-wrapContainer-borderRadius);`

const MainContainer = styled.div`
width: var(--opportunitiesSectionContainer-mainContainer-width);
display: var(--opportunitiesSectionContainer-mainContainer-display);
flex-direction: var(--opportunitiesSectionContainer-mainContainer-flexDirection);
gap: var(--opportunitiesSectionContainer-mainContainer-gap);
border-bottom: var(--opportunitiesSectionContainer-mainContainer-borderBottom);`

const UpperContainer = styled.div`
width: var(--opportunitiesSectionContainer-upperContainer-width);
display: var(--opportunitiesSectionContainer-upperContainer-display);
align-items: var(--opportunitiesSectionContainer-upperContainer-alignItems);
justify-content: var(--opportunitiesSectionContainer-upperContainer-justifyContent);

@media (max-width: 640px) {
    flex-direction: var(--opportunitiesSectionContainer-upperContainer-flexDirection);
    gap: var(--opportunitiesSectionContainer-upperContainer-gap); 
  }
`

const TitleContainer = styled.div`
display: var(--opportunitiesSectionContainer-titleContainer-display);
gap: var(--opportunitiesSectionContainer-titleContainer-gap);
align-items: var(--opportunitiesSectionContainer-titleContainer-alignItems);

h1 {
  font-size: var(--opportunitiesSectionContainer-titleContainer-h1-fontSize);
  font-weight: var(--opportunitiesSectionContainer-titleContainer-h1-fontWeight);
  margin: var(--opportunitiesSectionContainer-titleContainer-h1-margin);}`

const FindOpportunityButton = styled.button`
color: var(--color-white);
background-color: var(--color-aubergine);
height: var(--opportunitiesSectionContainer-findOpportunityButton-height);
border-radius: var(--opportunitiesSectionContainer-findOpportunityButton-borderRadius);
font-size: var(--opportunitiesSectionContainer-findOpportunityButton-fontSize);
font-weight: var(--opportunitiesSectionContainer-findOpportunityButton-fontWeight);
padding-left: var(--opportunitiesSectionContainer-findOpportunityButton-paddingLeft);
padding-right: var(--opportunitiesSectionContainer-findOpportunityButton-paddingRight);`

const OptionsContainer = styled.div`
width: var(--opportunitiesSectionContainer-optionsContainer-width);
height: var(--opportunitiesSectionContainer-optionsContainer-height);
display: var(--opportunitiesSectionContainer-optionsContainer-display);
gap: var(--opportunitiesSectionContainer-optionsContainer-gap);

button {
  padding-left: var(--opportunitiesSectionContainer-optionsContainer-button-paddingLeft);
  padding-right: var(--opportunitiesSectionContainer-optionsContainer-button-paddingRight);
  border: var(--opportunitiesSectionContainer-optionsContainer-button-border);
  background-color: var(--color-white);
  color: var(--color-midnight);
  font-size: var(--opportunitiesSectionContainer-optionsContainer-button-fontSize);
  font-weight: var(--opportunitiesSectionContainer-optionsContainer-button-fontWeight);
  display: var(--opportunitiesSectionContainer-optionsContainer-button-display);
  gap: var(--opportunitiesSectionContainer-optionsContainer-button-gap);
  align-items: var(--opportunitiesSectionContainer-optionsContainer-button-alignItems);

  div {
    border-radius: var(--opportunitiesSectionContainer-optionsContainer-button-div-borderRadius);
    background-color: var(--color-red-600);
    color: var(--color-white);
    width: var(--opportunitiesSectionContainer-optionsContainer-button-div-width);
    height: var(--opportunitiesSectionContainer-optionsContainer-button-div-height);
    display: var(--opportunitiesSectionContainer-optionsContainer-button-div-display);
    align-items: var(--opportunitiesSectionContainer-optionsContainer-button-div-alignItems);
    justify-content: var(--opportunitiesSectionContainer-optionsContainer-button-div-justifyContent);
    }
  }

  button.active {
    color: var(--color-violet-500);
    border-bottom: var(--opportunitiesSectionContainer-optionsContainer-buttonActive-borderBottom);
  }

  @media (max-width: 640px) {
    height: var(--opportunitiesSectionContainer-optionsContainer-heightMobile);
    display: var(--opportunitiesSectionContainer-optionsContainer-displayMobile);
    grid-template-columns: var(--opportunitiesSectionContainer-optionsContainer-gridTemplateColumnsMobile);
    gap: var(--opportunitiesSectionContainer-optionsContainer-gapMobile);

    button {
      justify-content: var(--opportunitiesSectionContainer-optionsContainer-button-justifyContentMobile);
    }
  }
`
const VolunteerOpportunitiesSectionContainer = () => {

const {opportunities} = useVolunteerOpportunities();
const [activeTab, setActiveTab] = useState('Pending');
const pendingsQuantity = 1; // TODO: later I plan this number to be calculated by how many expandable bars are marked as pending

  return (
    <WrapContainer>
      <MainContainer>
        <UpperContainer>
          <TitleContainer>
            <div>Star</div>
            <h1>Opportunities</h1>
          </TitleContainer>
          <FindOpportunityButton>Find Opportunity</FindOpportunityButton>
        </UpperContainer>
        <OptionsContainer>
          <button onClick={() => setActiveTab('Pending')} 
          className={activeTab === 'Pending' ? 'active' : ''}>
            <span>Pending</span>
            <div>{pendingsQuantity}</div>
          </button>
          <button onClick={() => setActiveTab('Matched')}
          className={activeTab === 'Matched' ? 'active' : ''}>Matched</button>
          <button onClick={() => setActiveTab('Active')}
          className={activeTab === 'Active' ? 'active' : ''}>Active</button>
          <button onClick={() => setActiveTab('Past')}
          className={activeTab === 'Past' ? 'active' : ''}>Past</button>
        </OptionsContainer>
      </MainContainer>
      <OpportunitiesList opportunities={opportunities} activeTab={activeTab}/>
    </WrapContainer>
  )
}

export default VolunteerOpportunitiesSectionContainer