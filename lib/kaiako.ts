export const KAIAKO_PLAN_ID = "pln_kaiako-4gi90evx";

type PlanConnection = {
  planId?: string;
  active?: boolean;
  status?: string;
};

type MemberLike = {
  planConnections?: PlanConnection[];
} | null;

export function isKaiako(member: MemberLike): boolean {
  const connections = member?.planConnections ?? [];
  return connections.some(
    (c) => c.planId === KAIAKO_PLAN_ID && c.active === true,
  );
}
