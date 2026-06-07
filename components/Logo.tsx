export type LogoTheme = "blue" | "yellow" | "green";

export function Logo({ theme = "blue" }: { theme?: LogoTheme }) {
  return <span className={`logo-icon logo-${theme}`}>IMG</span>;
}
