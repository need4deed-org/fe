"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { UserRole } from "need4deed-sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/Layout";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { BulletList, NoteText, SectionHeader, TextLink } from "@/components/Static/styled";
import { Card, CardGrid } from "@/components/styled/card-grid";
import { Heading2, Heading3 } from "@/components/styled/text";
import { CONTACT_EMAIL } from "@/config/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coordinatorHelpTree, findHelpPath, HelpBlock, HelpNode, ngoHelpTree } from "./help-tree";
import { Breadcrumbs, ChoiceCard, RelatedLinks } from "./styles";

export const HELP_TOPIC_PARAM = "topic";

function getHelpTree(role?: UserRole): HelpNode[] | undefined {
  if (role === UserRole.AGENT) return ngoHelpTree;
  if (role === UserRole.COORDINATOR || role === UserRole.ADMIN) return coordinatorHelpTree;
  return undefined;
}

function HelpBlocks({ blocks }: { blocks: HelpBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if ("text" in block) return <NoteText key={index}>{block.text}</NoteText>;
        const items = "steps" in block ? block.steps : block.list;
        return (
          <BulletList key={index} as={"steps" in block ? "ol" : "ul"}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </BulletList>
        );
      })}
    </>
  );
}

export function Help() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tree = getHelpTree(user?.role);
  const path = tree ? findHelpPath(tree, searchParams.get(HELP_TOPIC_PARAM)) : [];
  const current = path.at(-1);
  const choices = current ? current.children : tree;
  const isCoordinator = tree === coordinatorHelpTree;

  const nodeTitle = (id: string) => t(`dashboard.help.nodes.${id}.title`);
  const goTo = (id?: string) => router.push(id ? `${pathname}?${HELP_TOPIC_PARAM}=${id}` : pathname);

  if (!user) return null;

  return (
    <DashboardLayout>
      <PageContainer>
        <Heading2>{t("dashboard.help.title")}</Heading2>

        {!tree && (
          <NoteText>
            {t("dashboard.help.noHelp")} <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </NoteText>
        )}

        {current && (
          <>
            <BackButton onClick={() => goTo(path.at(-2)?.id)}>
              <ArrowLeftIcon size={24} />
              {t("dashboard.help.back")}
            </BackButton>
            <nav aria-label={t("dashboard.help.title")}>
              <Breadcrumbs>
                <li>
                  <BackButton onClick={() => goTo()}>{t("dashboard.help.title")}</BackButton>
                </li>
                {path.map((node) => (
                  <li key={node.id}>
                    {node === current ? (
                      <span aria-current="page">{nodeTitle(node.id)}</span>
                    ) : (
                      <BackButton onClick={() => goTo(node.id)}>{nodeTitle(node.id)}</BackButton>
                    )}
                  </li>
                ))}
              </Breadcrumbs>
            </nav>
          </>
        )}

        {tree && choices && (
          <>
            <Heading3 margin={0}>{current ? nodeTitle(current.id) : t("dashboard.help.rootQuestion")}</Heading3>
            <CardGrid>
              {choices.map((node) => (
                <ChoiceCard key={node.id} onClick={() => goTo(node.id)}>
                  <SectionHeader>{nodeTitle(node.id)}</SectionHeader>
                </ChoiceCard>
              ))}
            </CardGrid>
          </>
        )}

        {current && !current.children && (
          <Card>
            <Heading3 margin={0}>{nodeTitle(current.id)}</Heading3>
            <HelpBlocks
              blocks={t(`dashboard.help.nodes.${current.id}.blocks`, { returnObjects: true }) as HelpBlock[]}
            />
            {current.related && (
              <RelatedLinks>
                <SectionHeader>{t("dashboard.help.related")}</SectionHeader>
                {current.related.map((id) => (
                  <BackButton key={id} onClick={() => goTo(id)}>
                    <ArrowRightIcon size={20} />
                    {nodeTitle(id)}
                  </BackButton>
                ))}
              </RelatedLinks>
            )}
            <NoteText>
              {isCoordinator ? (
                t("dashboard.help.contactCoordinator")
              ) : (
                <>
                  {t("dashboard.help.contactNgo")} <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
                </>
              )}
            </NoteText>
          </Card>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

export default Help;
