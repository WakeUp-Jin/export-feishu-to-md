/**
 * 飞书文档 Block 类型枚举
 * 参考: https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/document-docx/docx-v1/data-structure/block
 */
export enum BlockType {
  /** 文档根节点 */
  Page = 1,
  /** 段落 */
  Text = 2,
  Heading1 = 3,
  Heading2 = 4,
  Heading3 = 5,
  Heading4 = 6,
  Heading5 = 7,
  Heading6 = 8,
  Heading7 = 9,
  Heading8 = 10,
  Heading9 = 11,
  /** 无序列表 */
  Bullet = 12,
  /** 有序列表 */
  Ordered = 13,
  /** 代码块 */
  Code = 14,
  /** 引用 */
  Quote = 15,
  /** 引用文档 */
  MentionDoc = 16,
  /** 代办事项 */
  TodoList = 17,
  /** 多维表格 */
  Bitable = 18,
  /** 高亮块 */
  Callout = 19,
  /** 群聊卡片 */
  ChatCard = 20,
  /** 流程图/UML */
  Diagram = 21,
  /** 分割线 */
  Divider = 22,
  /** 文件 */
  File = 23,
  /** 分栏 */
  Grid = 24,
  /** 分栏列 */
  GridColumn = 25,
  /** 内嵌网页 */
  Iframe = 26,
  /** 图片 */
  Image = 27,
  /** 小组件 */
  Widget = 28,
  /** 思维笔记 */
  MindNote = 29,
  /** 电子表格 */
  Sheet = 30,
  /** 表格 */
  Table = 31,
  /** 表格单元格 */
  TableCell = 32,
  /** 视图 */
  View = 33,
  /** 引用容器 */
  QuoteContainer = 34,
  /** 画板 */
  Board = 43,
  /** 同步块 */
  SyncedBlock = 999,
}

export enum StyleAlign {
  Left = 1,
  Center = 2,
  Right = 3,
}

export enum CodeLanguage {
  PlainText = 1,
  ABAP,
  Ada,
  Apache,
  Apex,
  AssemblyLanguage,
  Bash,
  CSharp,
  CPlusPlus,
  C,
  COBOL,
  CSS,
  CoffeeScript,
  D,
  Dart,
  Delphi,
  Django,
  Dockerfile,
  Erlang,
  Fortran,
  FoxPro,
  Go,
  Groovy,
  HTML,
  HTMLBars,
  HTTP,
  Haskell,
  JSON,
  Java,
  JavaScript,
  Julia,
  Kotlin,
  LateX,
  Lisp,
  Logo,
  Lua,
  MATLAB,
  Makefile,
  Markdown,
  Nginx,
  ObjectiveC,
  OpenEdgeABL,
  PHP,
  Perl,
  PostScript,
  PowerShell,
  Prolog,
  ProtoBuf,
  Python,
  R,
  RPG,
  Ruby,
  Rust,
  SAS,
  SCSS,
  SQL,
  Scala,
  Scheme,
  Scratch,
  Shell,
  Swift,
  Thrift,
  TypeScript,
  VBScript,
  VisualBasic,
  XML,
  YAML,
  CMake,
  Diff,
  Gherkin,
  GraphQL,
  OpenGLShadingLanguage,
  Properties,
  Solidity,
  TOML,
}

/**
 * 获取代码语言名称
 */
export function getCodeLanguage(code: CodeLanguage): string {
  switch (code) {
    case CodeLanguage.PlainText:
      return "text";
    case CodeLanguage.AssemblyLanguage:
      return "assembly";
    case CodeLanguage.CPlusPlus:
      return "cpp";
    case CodeLanguage.CSharp:
      return "csharp";
    case CodeLanguage.CoffeeScript:
      return "coffee";
    case CodeLanguage.Dockerfile:
      return "docker";
    case CodeLanguage.FoxPro:
      return "foxpro";
    case CodeLanguage.TypeScript:
      return "typescript";
    case CodeLanguage.JavaScript:
      return "javascript";
    case CodeLanguage.Rust:
      return "rust";
    case CodeLanguage.Python:
      return "python";
    case CodeLanguage.Ruby:
      return "ruby";
    case CodeLanguage.Markdown:
      return "markdown";
    case CodeLanguage.ObjectiveC:
      return "objectivec";
    case CodeLanguage.VisualBasic:
      return "vb";
    default:
      return CodeLanguage[code]?.toLowerCase() || "";
  }
}

export enum Color {
  LightPink = 1,
  LightOrange,
  LightYellow,
  LightGreen,
  LightBlue,
  LightPurple,
  LightGray,
  DarkPink,
  DarkOrange,
  DarkYellow,
  DarkGreen,
  DarkBlue,
  DarkPurple,
  DarkGray,
  DarkSilverGray,
}

export enum IframeType {
  Bilibili = 1,
  Xigua = 2,
  Youku = 3,
  Airtable = 4,
  BaiduMap = 5,
  GaodeMap = 6,
  Figma = 8,
  Modao = 9,
  Canva = 10,
  CodePen = 11,
  FeishuWenjuan = 12,
  Jinshuju = 13,
}

// --- Text element types ---

export interface TextStyle {
  align: StyleAlign;
  done: boolean;
  folded: boolean;
  language: CodeLanguage;
  wrap: boolean;
}

export interface TextLink {
  url: string;
}

export interface TextElementStyle {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  inline_code: boolean;
  background_color: Color;
  text_color: Color;
  link: TextLink;
}

export interface TextElement {
  text_run?: TextRun;
  file?: InlineFile;
  inline_block?: InlineBlock;
  equation?: TextRun;
  mention_doc?: MentionDoc;
}

export enum ObjType {
  Doc = 1,
  Sheet = 3,
  Bitable = 8,
  MindNote = 11,
  File = 12,
  Slide = 15,
  Wiki = 16,
  Docx = 22,
}

export interface MentionDoc {
  token: string;
  obj_type: ObjType;
  url: string;
  title: string;
  text_element_style: TextElementStyle;
}

export interface InlineFile {
  file_token: string;
  source_block_id: string;
  text_element_style: TextElementStyle;
}

export interface TextRun {
  content: string;
  text_element_style?: TextElementStyle;
}

export interface InlineBlock {
  block_id: string;
  text_element_style: TextElementStyle;
}

export interface TextBlock {
  style: TextStyle;
  elements: TextElement[];
  children: string[];
}

export interface ImageBlock {
  width: number;
  height: number;
  token: string;
  align: StyleAlign;
}

export interface TableBlock {
  cells: string[];
  property: {
    row_size: number;
    column_size: number;
    column_width: number[];
    header_column: boolean;
    header_row: boolean;
    merge_info: TableMergeInfo[];
  };
}

export interface TableMergeInfo {
  row_span: number;
  col_span: number;
}

// --- Callout types ---

export enum CalloutBackgroundColor {
  LightRed = 1,
  LightOrange = 2,
  LightYellow = 3,
  LightGreen = 4,
  LightBlue = 5,
  LightPurple = 6,
  LightGray = 7,
  DarkRed = 8,
  DarkOrange = 9,
  DarkYellow = 10,
  DarkGreen = 11,
  DarkBlue = 12,
  DarkPurple = 13,
  DarkGray = 14,
}

export const CalloutBackgroundColorMap: Record<number, string> = {
  1: "#fef2f2",
  2: "#fff7ed",
  3: "#fefce8",
  4: "#f0fdf4",
  5: "#eff6ff",
  6: "#faf5ff",
  7: "#f9fafb",
  8: "#fecaca",
  9: "#fed7aa",
  10: "#fef08a",
  11: "#bbf7d0",
  12: "#bfdbfe",
  13: "#e9d5ff",
  14: "#e5e7eb",
};

export enum CalloutBorderColor {
  Red = 1,
  Orange = 2,
  Yellow = 3,
  Green = 4,
  Blue = 5,
  Purple = 6,
  Gray = 7,
}

export type FontColor = CalloutBorderColor;

export const CalloutBorderColorMap: Record<number, string> = {
  1: "#fecaca",
  2: "#fed7aa",
  3: "#fef08a",
  4: "#bbf7d0",
  5: "#bfdbfe",
  6: "#e9d5ff",
  7: "#e5e7eb",
};

export const FontColorMap: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#3b82f6",
  6: "#a855f7",
  7: "#6b7280",
};

export interface CalloutBlock {
  background_color: CalloutBackgroundColor;
  border_color: CalloutBorderColor;
  text_color: FontColor;
  emoji_id: string;
}

// --- Main Block interface ---

export interface Block {
  block_id: string;
  parent_id: string;
  children: string[];
  block_type: BlockType;
  page: TextBlock;
  text: TextBlock;
  heading1: TextBlock;
  heading2: TextBlock;
  heading3: TextBlock;
  heading4: TextBlock;
  heading5: TextBlock;
  heading6: TextBlock;
  heading7: TextBlock;
  heading8: TextBlock;
  heading9: TextBlock;
  bullet: TextBlock;
  ordered: TextBlock;
  code: TextBlock;
  quote: TextBlock;
  todo: TextBlock;
  bitable: TextBlock;
  callout: CalloutBlock;
  chat_card: TextBlock;
  diagram: TextBlock;
  divider: TextBlock;
  file: {
    name: string;
    token: string;
  };
  grid: {
    column_size: number;
  };
  grid_column: {
    width_ratio: number;
  };
  iframe: {
    component: {
      iframe_type: IframeType;
      url: string;
    };
  };
  image: ImageBlock;
  table: TableBlock;
  table_cell: TextBlock;
  board: ImageBlock;
}

export function getAlignStyle(align: StyleAlign): string {
  switch (align) {
    case StyleAlign.Left:
      return "left";
    case StyleAlign.Center:
      return "center";
    case StyleAlign.Right:
      return "right";
    default:
      return "left";
  }
}

export interface FileToken {
  token: string;
  type: "file" | "image" | "board";
}

// --- API response types ---

export interface FeishuApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface DocumentInfo {
  document: {
    document_id: string;
    revision_id: number;
    title: string;
  };
}

export interface DocumentBlocksResponse {
  items: Block[];
  has_more: boolean;
  page_token?: string;
}

export interface TenantAccessTokenResponse {
  code: number;
  msg: string;
  tenant_access_token: string;
  expire: number;
}

// --- Wiki types ---

export interface WikiNodeInfo {
  node: {
    space_id: string;
    node_token: string;
    obj_token: string;
    obj_type: string;
    parent_node_token: string;
    node_type: string;
    origin_node_token: string;
    origin_space_id: string;
    has_child: boolean;
    title: string;
    obj_create_time: string;
    obj_edit_time: string;
    node_create_time: string;
    creator: string;
    owner: string;
  };
}
