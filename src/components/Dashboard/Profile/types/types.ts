export enum ProfileCardTypes {
  VOLUNTEER_HEADER = "VOLUNTEER_HEADER",
  CONTACT = "CONTACT",
  VOLUNTEER = "VOLUNTEER",
  OPPORTUNITIES = "OPPORTUNITIES",
  COORDINATE = "COORDINATE",
  DOCUMENTS = "DOCUMENTS",
  ACTIVITY = "ACTIVITY",
}

export interface ProfileCardProps {
  type: ProfileCardTypes;
  title: string;
}

export enum IconName {
  Baby = "baby",
  Bicycle = "bicycle",
  CalendarStar = "calendarStar",
  ChartLine = "chartLine",
  ChatCircleDots = "chatCircleDots",
  ChatsCircle = "chatsCircle",
  ChatsTeardrop = "chatsTeardrop",
  ClipboardText = "clipboardText",
  Gift = "gift",
  PingPong = "pingPong",
  ShootingStar = "shootingStar",
  Sparkle = "sparkle",
  UserCheck = "userCheck",
  UserCircle = "userCircle",
  Users = "users",
}
