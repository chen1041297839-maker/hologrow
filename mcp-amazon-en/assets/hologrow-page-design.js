(() => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const designAssetBase = new URL(
    "./figma-trust/",
    document.currentScript?.src || document.baseURI,
  );
  const designAssetUrl = (fileName) => new URL(fileName, designAssetBase).href;

  const alignHeroWithHomepage = () => {
    const hero = document.querySelector(
      ".marrow-site-page > section:first-of-type",
    );
    if (!hero) return;

    const eyebrow = Array.from(hero.querySelectorAll("p")).find(
      (item) =>
        item.textContent?.trim() ===
        (isEnglish
          ? "Amazon MCP · prepared commerce context"
          : "Amazon MCP · 为 AI 准备好的电商数据"),
    );
    eyebrow?.remove();

    const dialogue = hero.querySelector("aside.am-conversations");
    const dialogueShell = dialogue?.parentElement?.parentElement;
    if (dialogue && dialogueShell) {
      dialogue.classList.add("hologrow-dialogue");
      dialogueShell.classList.add("hologrow-dialogue-shell");
      const carouselControls = dialogue.querySelector(".am-carousel-controls");
      if (carouselControls) {
        carouselControls.hidden = true;
        carouselControls.setAttribute("aria-hidden", "true");
      }
    }

    const firstPartnerLogo = hero.querySelector(
      'img[alt="Amazon Selling Partner Appstore"]',
    );
    const partnerLogos = firstPartnerLogo?.parentElement;
    if (partnerLogos && dialogueShell) {
      partnerLogos.classList.add("hologrow-hero-partner-logos");
      dialogueShell.after(partnerLogos);
    }
  };

  const alignMcpFlow = () => {
    const heading = Array.from(document.querySelectorAll("h2")).find(
      (item) =>
        item.textContent?.includes(isEnglish ? "What is" : "什么是") &&
        item.textContent?.includes("Amazon MCP"),
    );
    const section = heading?.closest("section");
    const flow = section?.querySelector(".mt-10.grid");
    if (!flow) return;

    section.classList.add("hologrow-mcp-section");
    const introduction = heading?.nextElementSibling;
    if (introduction?.tagName === "P") {
      introduction.classList.add("hologrow-mcp-intro");
      introduction.parentElement?.classList.add("hologrow-mcp-copy");
    }

    const cards = Array.from(flow.children).filter((item) =>
      item.classList.contains("landing-page-card"),
    );
    const [sourceCard, mcpCard, outputCard] = cards;
    if (!sourceCard || !mcpCard || !outputCard) return;

    flow.classList.add("hologrow-mcp-flow");
    sourceCard.classList.add("hologrow-mcp-source");
    mcpCard.classList.add("hologrow-mcp-stage");
    outputCard.classList.add("hologrow-mcp-output");

    const stagePanel = mcpCard.children[1];
    stagePanel?.classList.add("hologrow-mcp-stage-panel");
    stagePanel
      ?.querySelector("[data-endpoint-copy]")
      ?.classList.add("hologrow-mcp-endpoint");
    stagePanel
      ?.querySelector("ul")
      ?.classList.add("hologrow-mcp-stage-list");

    const outputArtwork = outputCard.querySelector("img");
    const outputLinks = outputCard.querySelector("div.grid");
    outputArtwork?.classList.add("hologrow-mcp-output-artwork");
    outputLinks?.classList.add("hologrow-mcp-output-links");

    const brandRow = mcpCard.firstElementChild;
    const hologrowLogo = document.querySelector('header img[alt="Hologrow"]');
    if (brandRow && hologrowLogo) {
      const logo = hologrowLogo.cloneNode(true);
      logo.className = "hologrow-mcp-brand-logo";
      logo.alt = "Hologrow";
      const label = document.createElement("span");
      label.className = "hologrow-mcp-label";
      label.textContent = "MCP";
      brandRow.classList.add("hologrow-mcp-brand");
      brandRow.replaceChildren(logo, label);
    }

    const sourceLinks = Array.from(sourceCard.querySelectorAll("a"));
    const sourceLogos = new Map([
      [
        "Seller Central",
        document.querySelector('img[alt="Amazon Selling Partner Appstore"]'),
      ],
      [
        "Amazon Ads",
        document.querySelector('img[alt="Amazon Ads Verified Partner"]'),
      ],
    ]);

    sourceLinks.forEach((link) => {
      const label = link.textContent?.trim();
      const sourceLogo = sourceLogos.get(label);
      if (!label || !sourceLogo) return;

      const logo = sourceLogo.cloneNode(true);
      logo.className = "hologrow-source-logo";
      logo.alt = "";
      link.classList.add("hologrow-logo-link");
      link.setAttribute("aria-label", label);
      link.replaceChildren(logo);
    });
  };

  const separateChatGptAndCodex = () => {
    const heading = Array.from(document.querySelectorAll("h2")).find((item) =>
      item.textContent?.includes(
        isEnglish ? "Set up" : "为你的 AI 配置",
      ),
    );
    const section = heading?.closest("section");
    const combinedCard = Array.from(
      section?.querySelectorAll("article") ?? [],
    ).find((card) => card.textContent?.includes("ChatGPT / Codex"));
    const grid = combinedCard?.parentElement;
    if (!section || !grid) return;

    section.classList.add("hologrow-integrations-section");
    grid.classList.add("hologrow-integration-grid");

    const markCards = () => {
      Array.from(grid.children).forEach((card) => {
        if (card.tagName === "ARTICLE") {
          card.classList.add("hologrow-integration-card");
        }
      });
    };

    if (!combinedCard) {
      markCards();
      return;
    }

    const codexCard = combinedCard.cloneNode(true);

    const configureCard = (card, client) => {
      const header = card.firstElementChild;
      const iconGroup = header?.firstElementChild;
      const title = card.querySelector("h3");
      const description = title?.nextElementSibling;
      const actionLinks = Array.from(card.querySelectorAll("a"));
      const isChatGpt = client === "chatgpt";

      Array.from(iconGroup?.children ?? []).forEach((icon) => {
        const keep = isChatGpt ? icon.tagName === "IMG" : icon.tagName === "svg";
        if (!keep) icon.remove();
      });

      if (title) {
        title.textContent = isChatGpt ? "ChatGPT" : "Codex";
        title.id = `hologrow-${client}-title`;
        card.setAttribute("aria-labelledby", title.id);
      }

      if (description) {
        description.textContent = isEnglish
          ? isChatGpt
            ? "Investigate business changes in ChatGPT."
            : "Use Codex to explore the Amazon data behind them."
          : isChatGpt
            ? "在 ChatGPT 中追问经营变化，结合已同步的 Amazon 数据完成对话分析与复盘。"
            : "用 Codex 探索经营变化背后的 Amazon 数据，在代码与 Agent 工作流中核对分析结果。";
      }

      actionLinks.forEach((link) => {
        const keep = link.href.includes(
          isChatGpt ? "using-chatgpt" : "using-codex",
        );
        if (!keep) link.remove();
      });

      card.dataset.hologrowClient = client;
    };

    configureCard(combinedCard, "chatgpt");
    configureCard(codexCard, "codex");
    combinedCard.after(codexCard);
    markCards();
  };

  const alignSecurityWithFigma = () => {
    const section = document.querySelector("#security");
    const inner = section?.firstElementChild;
    const header = inner?.children[0];
    const grid = inner?.children[1];
    const note = inner?.children[2];

    if (!section || !inner || !header || !grid || !note) return;

    const children = Array.from(grid.children);
    const partnerCards = children.filter((item) => item.tagName === "DIV");
    const articles = children.filter((item) => item.tagName === "ARTICLE");
    if (partnerCards.length < 2 || articles.length < 4) return;

    const articleByTitle = (title) =>
      articles.find((article) => article.querySelector("h3")?.textContent === title);

    const oauthCard = articleByTitle(isEnglish ? "Official OAuth" : "官方 OAuth");
    const readOnlyCard = articleByTitle(
      isEnglish ? "Read-only data access" : "只读数据访问",
    );
    const revokeCard = articleByTitle(
      isEnglish ? "Revocation, isolation & deletion" : "撤销、隔离与删除",
    );
    const statusCard = articleByTitle(
      isEnglish ? "Visible status, minimized information" : "状态可见、信息最小化",
    );
    if (!oauthCard || !readOnlyCard || !revokeCard || !statusCard) return;

    section.classList.add("hologrow-security-section");
    inner.className = "hologrow-security-inner";
    header.className = "hologrow-security-header";
    grid.className = "hologrow-security-layout";
    note.className = "hologrow-security-note";

    const intro = header.querySelector("h2")?.nextElementSibling;
    if (intro && !isEnglish) {
      intro.textContent = "通过 Amazon 官方授权接入，不修改账号。";
    }

    const configurePartnerCard = ({
      card,
      photo,
      logo,
      logoAlt,
      overlay,
      caption,
      position,
    }) => {
      card.className = "hologrow-security-partner";
      card.replaceChildren();

      const photoImage = document.createElement("img");
      photoImage.className = "hologrow-security-partner-photo";
      photoImage.src = photo;
      photoImage.alt = "";
      photoImage.style.objectPosition = position;

      const shade = document.createElement("span");
      shade.className = "hologrow-security-partner-shade";
      shade.style.setProperty("--hologrow-security-shade", overlay);

      const logoImage = document.createElement("img");
      logoImage.className = "hologrow-security-partner-logo";
      logoImage.src = logo;
      logoImage.alt = logoAlt;

      card.append(photoImage, shade, logoImage);

      if (caption) {
        card.tabIndex = 0;
        const captionElement = document.createElement("span");
        captionElement.className = "hologrow-security-partner-caption";
        captionElement.textContent = caption;
        card.append(captionElement);
      }
    };

    configurePartnerCard({
      card: partnerCards[0],
      photo: designAssetUrl("amazon-ads-photo.png"),
      logo: designAssetUrl("amazon-ads-logo.png"),
      logoAlt: "Amazon Ads Verified Partner",
      overlay: "rgb(0 0 0 / 50%)",
      caption: isEnglish ? "Official authorization" : "官方合作伙伴身份",
      position: "center 35%",
    });

    configurePartnerCard({
      card: partnerCards[1],
      photo: designAssetUrl("amazon-appstore-photo.png"),
      logo: designAssetUrl("amazon-appstore-logo.png"),
      logoAlt: "Amazon Appstore",
      overlay: "rgb(0 0 0 / 20%)",
      caption: isEnglish ? "Amazon Appstore" : "已进入 Amazon 应用生态",
      position: "center",
    });

    const configureTrustCard = (card, icon, iconSize = 20) => {
      const cardHeader = card.firstElementChild;
      const title = card.querySelector("h3");
      const body = title?.parentElement?.nextElementSibling;
      const oldIcon = cardHeader?.querySelector("svg, img");
      const iconImage = document.createElement("img");

      card.className = "hologrow-security-card";
      if (cardHeader) cardHeader.className = "hologrow-security-card-header";
      if (title) title.className = "hologrow-security-card-title";
      if (body) body.className = "hologrow-security-card-body";

      iconImage.className = "hologrow-security-card-icon";
      iconImage.src = icon;
      iconImage.alt = "";
      iconImage.setAttribute("aria-hidden", "true");
      iconImage.width = iconSize;
      iconImage.height = iconSize;
      oldIcon?.replaceWith(iconImage);
    };

    configureTrustCard(oauthCard, designAssetUrl("shield-check.svg"));
    configureTrustCard(readOnlyCard, designAssetUrl("eye.svg"), 22);
    configureTrustCard(revokeCard, designAssetUrl("revoke.svg"));
    configureTrustCard(statusCard, designAssetUrl("activity.svg"), 22);

    const mediaColumn = document.createElement("div");
    const accessColumn = document.createElement("div");
    const controlsColumn = document.createElement("div");
    mediaColumn.className = "hologrow-security-column hologrow-security-media-column";
    accessColumn.className = "hologrow-security-column";
    controlsColumn.className = "hologrow-security-column";
    mediaColumn.append(partnerCards[0], partnerCards[1]);
    accessColumn.append(oauthCard, revokeCard);
    controlsColumn.append(readOnlyCard, statusCard);
    grid.replaceChildren(mediaColumn, accessColumn, controlsColumn);

    if (isEnglish) {
      note.remove();
    } else {
      note.textContent =
        "官方 OAuth 和只读访问可以降低第三方风险。如 Hologrow 违反合同约定或法定数据保护义务并造成安全事件，将按合同和适用法律承担相应责任。任何服务商都无法保证 Amazon 不会因与其服务无关的政策或账号行为采取措施。";
    }
  };

  const initializeExclusiveFaq = () => {
    const faq = document.querySelector("#faq");
    if (!faq) return;

    const items = Array.from(faq.querySelectorAll("details"));
    items.forEach((item) => {
      item.setAttribute("name", "amazon-mcp-faq");
      const summary = item.querySelector("summary");
      summary?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        item.open = !item.open;
      });
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        alignHeroWithHomepage();
        alignMcpFlow();
        separateChatGptAndCodex();
        alignSecurityWithFigma();
        initializeExclusiveFaq();
      },
      { once: true },
    );
  } else {
    alignHeroWithHomepage();
    alignMcpFlow();
    separateChatGptAndCodex();
    alignSecurityWithFigma();
    initializeExclusiveFaq();
  }
})();
