export enum ProjectStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type ProjectTextVariant = "TITLE" | "HEADING" | "BODY" | "QUOTE";
export type ProjectBlockAlignment = "LEFT" | "CENTER" | "RIGHT";
export type ProjectMediaWidth = "STANDARD" | "WIDE" | "FULL";

export interface ProjectTextBlock {
  id: string;
  type: "TEXT";
  content: string;
  variant: ProjectTextVariant;
  alignment: ProjectBlockAlignment;
  bold: boolean;
  italic: boolean;
}

export interface ProjectImageBlock {
  id: string;
  type: "IMAGE";
  url: string;
  alt: string;
  caption: string;
  width: ProjectMediaWidth;
}

export interface ProjectVideoBlock {
  id: string;
  type: "VIDEO";
  url: string;
  posterUrl: string | null;
  caption: string;
  width: ProjectMediaWidth;
}

export interface ProjectCarouselItem {
  url: string;
  alt: string;
}

export interface ProjectCarouselBlock {
  id: string;
  type: "CAROUSEL";
  items: ProjectCarouselItem[];
  caption: string;
  width: ProjectMediaWidth;
}

export type ProjectBlock =
  | ProjectTextBlock
  | ProjectImageBlock
  | ProjectVideoBlock
  | ProjectCarouselBlock;

const escapeMarkdownText = (value: string): string =>
  value.replace(/([\\`*_{}\[\]()#+.!|>-])/g, "\\$1");

const mediaCaption = (caption: string): string =>
  caption.trim() ? `\n\n_${escapeMarkdownText(caption.trim())}_` : "";

export function projectBlocksToMarkdown(blocks: ProjectBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "TEXT") {
        let content = escapeMarkdownText(block.content.trim());
        if (!content) return "";
        if (block.bold) content = `**${content}**`;
        if (block.italic) content = `_${content}_`;

        switch (block.variant) {
          case "TITLE":
            return `# ${content}`;
          case "HEADING":
            return `## ${content}`;
          case "QUOTE":
            return content.split("\n").map((line) => `> ${line}`).join("\n");
          default:
            return content;
        }
      }

      if (block.type === "IMAGE") {
        if (!block.url.trim()) return "";
        return `![${escapeMarkdownText(block.alt)}](${block.url})${mediaCaption(block.caption)}`;
      }

      if (block.type === "VIDEO") {
        if (!block.url.trim()) return "";
        const label = block.caption.trim() || "Assistir ao vídeo";
        return `[${escapeMarkdownText(label)}](${block.url})`;
      }

      const images = block.items
        .filter((item) => Boolean(item.url.trim()))
        .map((item) => `![${escapeMarkdownText(item.alt)}](${item.url})`)
        .join("\n\n");
      return `${images}${mediaCaption(block.caption)}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function projectBlocksToSummary(blocks: ProjectBlock[]): string {
  const firstText = blocks.find(
    (block): block is ProjectTextBlock =>
      block.type === "TEXT" && Boolean(block.content.trim()),
  );
  return firstText?.content.trim().replace(/\s+/g, " ").slice(0, 500) ?? "";
}

export function hasProjectContent(blocks: ProjectBlock[]): boolean {
  return blocks.some((block) => {
    if (block.type === "TEXT") return Boolean(block.content.trim());
    if (block.type === "CAROUSEL") {
      return block.items.some((item) => Boolean(item.url.trim()));
    }
    return Boolean(block.url.trim());
  });
}

export function isProjectContentReady(blocks: ProjectBlock[]): boolean {
  return blocks.length > 0 && blocks.every((block) => {
    if (block.type === "TEXT") return Boolean(block.content.trim());
    if (block.type === "CAROUSEL") {
      return block.items.filter((item) => Boolean(item.url.trim())).length >= 2;
    }
    return Boolean(block.url.trim());
  });
}

export function parseProjectBlocks(value: unknown): ProjectBlock[] {
  return Array.isArray(value) ? value as ProjectBlock[] : [];
}
