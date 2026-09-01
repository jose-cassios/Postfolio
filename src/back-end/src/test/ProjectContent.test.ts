import { describe, expect, test } from "@jest/globals";
import {
  isProjectContentReady,
  projectBlocksToMarkdown,
  projectBlocksToSummary,
  type ProjectBlock,
} from "../modules/project/domain/valueObject/ProjectContent";

describe("ProjectContent", () => {
  const blocks: ProjectBlock[] = [
    {
      id: "intro",
      type: "TEXT",
      content: "Uma apresentação com impacto",
      variant: "HEADING",
      alignment: "LEFT",
      bold: true,
      italic: false,
    },
    {
      id: "gallery",
      type: "CAROUSEL",
      items: [
        { url: "https://example.com/one.jpg", alt: "Primeira tela" },
        { url: "https://example.com/two.jpg", alt: "Segunda tela" },
      ],
      caption: "Fluxo principal",
      width: "WIDE",
    },
  ];

  test("gera Markdown canônico e resumo a partir dos blocos", () => {
    expect(projectBlocksToMarkdown(blocks)).toContain(
      "## **Uma apresentação com impacto**",
    );
    expect(projectBlocksToMarkdown(blocks)).toContain(
      "![Primeira tela](https://example.com/one.jpg)",
    );
    expect(projectBlocksToSummary(blocks)).toBe("Uma apresentação com impacto");
  });

  test("só considera publicável quando todos os blocos estão completos", () => {
    const incompleteCarousel: ProjectBlock = {
      id: "incomplete",
      type: "CAROUSEL",
      items: [{ url: "", alt: "" }],
      caption: "",
      width: "WIDE",
    };

    expect(isProjectContentReady(blocks)).toBe(true);
    expect(isProjectContentReady([incompleteCarousel])).toBe(false);
  });
});
