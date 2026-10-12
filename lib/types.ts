export interface Company {
  name: string;             // 中文公司名
  name_en?: string;          // 英文公司名
  legal_person: string;      // 中文法人名
  legal_person_en?: string;   // 英文法人名
  status: string;            // 英文/中文状态
  establish_date: string;    // 创建日
  credit_code: string;       // 统一社会信用代码
}

export interface SearchResponse {
  original_keyword: string;
  translated_keyword: string;
  total_found: number;
  companies: Company[];
}

export type SearchErrorResponse = {
  error: string;
  detail?: string;
};