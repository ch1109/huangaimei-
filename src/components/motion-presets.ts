/** Shared entrance rhythm. Only opacity and transforms animate while scrolling. */
export const portfolioEase = [.22, 1, .36, 1] as const;

export function revealInView(reduced: boolean | null, delay = 0, distance = 20) {
  return {
    initial: reduced ? false as const : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .12, margin: '0px 0px -24px 0px' as const },
    transition: { duration: reduced ? 0 : .68, delay: reduced ? 0 : delay, ease: portfolioEase },
  };
}
