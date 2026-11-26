export type HelpNode = {
  id: string;
  children?: HelpNode[];
  related?: string[];
};

export type HelpBlock = { text: string } | { steps: string[] } | { list: string[] };

const leaf = (id: string, related?: string[]): HelpNode => ({ id, related });
const topic = (id: string, children: HelpNode[]): HelpNode => ({ id, children });

export const ngoHelpTree: HelpNode[] = [
  topic("ngoCreate", [
    leaf("ngoCreateWhichType", ["ngoCreateRegular", "ngoCreateAccompanying", "ngoCreateEvent"]),
    leaf("ngoCreateRegular", ["ngoCreateAfter", "ngoCreateBlocked"]),
    leaf("ngoCreateAccompanying", ["ngoCreateRules", "ngoCreateAfter", "ngoCreateBlocked"]),
    leaf("ngoCreateEvent", ["ngoCreateAfter", "ngoCreateBlocked"]),
    leaf("ngoCreateAfter", ["ngoCreateStatuses", "ngoFindByUs"]),
    leaf("ngoCreateBlocked"),
    leaf("ngoCreateDuplicate"),
    leaf("ngoCreateEdit"),
    leaf("ngoCreateRules"),
    leaf("ngoCreateStatuses"),
  ]),
  topic("ngoFind", [
    leaf("ngoFindByUs", ["ngoFindNobody"]),
    leaf("ngoFindRecommended", ["ngoFindMessages"]),
    leaf("ngoFindSearch", ["ngoFindMessages", "ngoFindNoContact"]),
    leaf("ngoFindOwn"),
    leaf("ngoFindNobody"),
    leaf("ngoFindNoContact"),
    leaf("ngoFindMessages"),
    leaf("ngoFindVetting"),
  ]),
  topic("ngoManage", [leaf("ngoManageMatched"), leaf("ngoManageAppreciation"), leaf("ngoManageStops")]),
  topic("ngoMenu", [
    leaf("ngoMenuHome", ["ngoCreateStatuses"]),
    leaf("ngoMenuVolunteers", ["ngoFindSearch", "ngoFindOwn"]),
    leaf("ngoMenuOpportunities"),
    leaf("ngoMenuAgents"),
    leaf("ngoMenuPosts"),
    leaf("ngoMenuProfile"),
  ]),
  topic("ngoAccount", [
    leaf("ngoAccountCreate"),
    leaf("ngoAccountNoEmail"),
    leaf("ngoAccountNoFacility"),
    leaf("ngoAccountPassword"),
    leaf("ngoAccountTraeger"),
  ]),
  leaf("ngoEfz"),
  leaf("ngoPosts"),
  topic("ngoPrivacy", [
    leaf("ngoPrivacyWhere"),
    leaf("ngoPrivacySecurity"),
    leaf("ngoPrivacyAvv"),
    leaf("ngoPrivacyPhotos"),
  ]),
];

export const coordinatorHelpTree: HelpNode[] = [
  leaf("coordProcess", ["coordCallRecord", "coordOptionsSend", "coordEfzWhen", "coordMatchHow", "coordFollowMonth"]),
  topic("coordCall", [
    leaf("coordCallAsk"),
    leaf("coordCallExplain"),
    leaf("coordCallRecord", ["coordOptionsFind", "coordEfzWhen"]),
    leaf("coordCallNoAnswer"),
  ]),
  topic("coordOptions", [
    leaf("coordOptionsFind", ["coordOptionsSend"]),
    leaf("coordOptionsSend", ["coordEfzWhen", "coordNoFitRetry"]),
    leaf("coordOptionsReverse"),
    leaf("coordOptionsNgoRequest", ["coordOptionsReverse"]),
    leaf("coordOptionsStale"),
  ]),
  topic("coordEfz", [
    leaf("coordEfzWhen", ["coordEfzSend", "coordEfzNotBerlin"]),
    leaf("coordEfzSend"),
    leaf("coordEfzReceived", ["coordMatchHow"]),
    leaf("coordEfzNotBerlin"),
  ]),
  topic("coordMatch", [leaf("coordMatchHow", ["coordEfzReceived", "coordFollowMonth"]), leaf("coordMatchUndo")]),
  topic("coordFollow", [leaf("coordFollowMonth", ["coordFollowStops"]), leaf("coordFollowStops")]),
  topic("coordNoFit", [leaf("coordNoFitRetry"), leaf("coordNoFitAccompanying")]),
  topic("coordReview", [leaf("coordReviewNew", ["coordReviewRules"]), leaf("coordReviewRules")]),
  topic("coordStatuses", [leaf("coordStatusesVolunteer"), leaf("coordStatusesMatch")]),
  leaf("coordMenu"),
];

export function findHelpPath(tree: HelpNode[], id: string | null): HelpNode[] {
  if (!id) return [];
  for (const node of tree) {
    if (node.id === id) return [node];
    const childPath = findHelpPath(node.children ?? [], id);
    if (childPath.length) return [node, ...childPath];
  }
  return [];
}
