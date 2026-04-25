export const PARENT_PLAN_ID = "pln_parent-8j350e9u";

export const PARENT_PRICE_IDS = [
  "prc_annual-fee-crsr030o",
  "prc_two-children-03su03t9",
  "prc_three-or-more-children-wd1cs0e9h",
] as const;

type PlanConnection = {
  planId?: string;
  active?: boolean;
  status?: string;
  payment?: { priceId?: string } | null;
};

type MemberLike = {
  planConnections?: PlanConnection[];
} | null;

export function isParent(member: MemberLike): boolean {
  const connections = member?.planConnections ?? [];
  return connections.some((c) => {
    if (c.planId === PARENT_PLAN_ID) return true;
    if (c.active !== true) return false;
    const priceId = c.payment?.priceId;
    return (
      typeof priceId === "string" &&
      (PARENT_PRICE_IDS as readonly string[]).includes(priceId)
    );
  });
}
