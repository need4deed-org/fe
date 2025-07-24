"use client"
import styled from "styled-components"

const PageContainer = styled.div`
display: flex;
background: var(--color-orchid);
`

export default function TestPage() {
  return (
    <PageContainer>
      <h1>Need4Deed</h1>
    </PageContainer>
  )
}