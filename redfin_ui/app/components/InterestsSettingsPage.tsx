// InterestsSettingsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

// 사용자 관심사 설정 페이지 Props
interface InterestsSettingsPageProps {
  onBack: () => void;
  user: any;
  onUpdateInterests?: (interests: string[]) => void;
}

// API 기본 URL (Spring Boot 백엔드)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// 관심사 데이터 정의
const JOB_INTERESTS = [
  { id: "developer", label: "개발자", value: "개발자" },
  { id: "planner", label: "기획자", value: "기획자" },
  { id: "student", label: "대학생", value: "대학생" },
  { id: "researcher", label: "연구원/교수", value: "연구원/교수" },
  { id: "policy", label: "정책작성자", value: "정책작성자" },
  { id: "general", label: "일반인", value: "일반인" },
];

const AI_COMPANIES = [
  { id: "openai", label: "OPENAI", value: "OPENAI" },
  { id: "gemini", label: "GEMINI", value: "GEMINI" },
  { id: "google", label: "GOOGLE", value: "GOOGLE" },
  { id: "microsoft", label: "MICROSOFT", value: "MICROSOFT" },
  { id: "meta", label: "META", value: "META" },
  { id: "amazon", label: "AMAZON", value: "AMAZON" },
];

const AI_FIELDS = [
  { id: "deep", label: "딥러닝", value: "딥러닝" },
  { id: "ml", label: "머신러닝", value: "머신러닝" },
  { id: "llm", label: "LLM", value: "LLM" },
  { id: "finetune", label: "파인튜닝", value: "파인튜닝" },
  { id: "data", label: "데이터분석", value: "데이터분석" },
  { id: "nlp", label: "자연어처리", value: "자연어처리" },
  { id: "cv", label: "컴퓨터비전", value: "컴퓨터비전" },
  { id: "rec", label: "추천시스템", value: "추천시스템" },
  { id: "genai", label: "생성AI", value: "생성AI" },
  { id: "rl", label: "강화학습", value: "강화학습" },
];

export function InterestsSettingsPage({ onBack, user, onUpdateInterests }: InterestsSettingsPageProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // 상태 변화 감지를 위한 useEffect 추가
  useEffect(() => {
    console.log('Selected interests updated:', {
      interest: selectedInterest,
      company: selectedCompany,
      field: selectedField
    });
  }, [selectedInterest, selectedCompany, selectedField]);

  // API 호출을 위한 공통 헤더 설정
  const getHeaders = () => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // 기존 관심사 데이터 로드
  const loadExistingInterests = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load existing interests...'); // 디버깅용

      // 세 개의 API를 병렬로 호출하여 기존 데이터 로드
      const [jobResponse, companyResponse, fieldResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/job-interest`, {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/api/ai-company`, {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/api/ai-field`, {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'include',
        })
      ]);

      console.log('API responses status:', {
        job: jobResponse.status,
        company: companyResponse.status,
        field: fieldResponse.status
      });

      // 직업 정보 응답 처리
      if (jobResponse.ok) {
        const contentType = jobResponse.headers.get('content-type');
        console.log('Job response content-type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          try {
            const jobData = await jobResponse.json();
            console.log('Job data received:', jobData);
            if (jobData && jobData.interest) {
              setSelectedInterest(jobData.interest);
              console.log('Set selected interest:', jobData.interest);
            }
          } catch (jsonError) {
            console.error('Failed to parse job response as JSON:', jsonError);
          }
        } else {
          const textResponse = await jobResponse.text();
          console.warn('직업 정보 API가 JSON이 아닌 응답을 반환했습니다:', textResponse.substring(0, 200) + '...');
        }
      } else if (jobResponse.status === 404) {
        console.log('직업 정보가 아직 설정되지 않았습니다 (404)');
      } else {
        console.warn('직업 정보 로드 실패:', jobResponse.status, jobResponse.statusText);
      }

      // AI기업 정보 응답 처리
      if (companyResponse.ok) {
        const contentType = companyResponse.headers.get('content-type');
        console.log('Company response content-type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          try {
            const companyData = await companyResponse.json();
            console.log('Company data received:', companyData);
            if (companyData && companyData.aiCompany) {
              setSelectedCompany(companyData.aiCompany);
              console.log('Set selected company:', companyData.aiCompany);
            }
          } catch (jsonError) {
            console.error('Failed to parse company response as JSON:', jsonError);
          }
        } else {
          const textResponse = await companyResponse.text();
          console.warn('AI기업 정보 API가 JSON이 아닌 응답을 반환했습니다:', textResponse.substring(0, 200) + '...');
        }
      } else if (companyResponse.status === 404) {
        console.log('AI기업 정보가 아직 설정되지 않았습니다 (404)');
      } else {
        console.warn('AI기업 정보 로드 실패:', companyResponse.status, companyResponse.statusText);
      }

      // AI분야 정보 응답 처리
      if (fieldResponse.ok) {
        const contentType = fieldResponse.headers.get('content-type');
        console.log('Field response content-type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          try {
            const fieldData = await fieldResponse.json();
            console.log('Field data received:', fieldData);
            if (fieldData && fieldData.aiField) {
              setSelectedField(fieldData.aiField);
              console.log('Set selected field:', fieldData.aiField);
            }
          } catch (jsonError) {
            console.error('Failed to parse field response as JSON:', jsonError);
          }
        } else {
          const textResponse = await fieldResponse.text();
          console.warn('AI분야 정보 API가 JSON이 아닌 응답을 반환했습니다:', textResponse.substring(0, 200) + '...');
        }
      } else if (fieldResponse.status === 404) {
        console.log('AI분야 정보가 아직 설정되지 않았습니다 (404)');
      } else {
        console.warn('AI분야 정보 로드 실패:', fieldResponse.status, fieldResponse.statusText);
      }

    } catch (error) {
      console.error("기존 관심사 로드 오류:", error);
      // 네트워크 오류 등의 경우만 사용자에게 메시지 표시
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showMessage("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.", "error");
      }
    } finally {
      setIsLoading(false);
      console.log('Finished loading existing interests');
    }
  };

  // 컴포넌트 마운트 시 기존 관심사 로드
  useEffect(() => {
    if (user) {
      loadExistingInterests();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // 직업 선택 처리
  const handleInterestChange = (value: string) => {
    setSelectedInterest(value);
  };

  // AI기업 선택 처리
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
  };

  // AI분야 선택 처리
  const handleFieldChange = (value: string) => {
    setSelectedField(value);
  };

  // 메시지 표시
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // 저장 처리 - Spring Boot API 호출
  const handleSave = async () => {
    if (!(selectedInterest && selectedCompany && selectedField)) {
      showMessage("모든 항목을 선택해주세요.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // 세 개의 API를 순차적으로 호출하여 각각의 테이블에 저장
      const jobResponse = await fetch(`${API_BASE_URL}/api/job-interest`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ interest: selectedInterest }),
      });

      const companyResponse = await fetch(`${API_BASE_URL}/api/ai-company`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ aiCompany: selectedCompany }),
      });

      const fieldResponse = await fetch(`${API_BASE_URL}/api/ai-field`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ aiField: selectedField }),
      });

      // 모든 API 호출이 성공했는지 확인
      if (jobResponse.ok && companyResponse.ok && fieldResponse.ok) {
        // 부모 컴포넌트에 업데이트 알림
        if (onUpdateInterests) {
          onUpdateInterests([selectedInterest, selectedCompany, selectedField]);
        }

        showMessage("선택한 정보가 데이터베이스에 저장되었습니다!", "success");
      } else {
        throw new Error("일부 저장에 실패했습니다.");
      }

    } catch (error) {
      console.error("저장 오류:", error);
      showMessage("저장 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ���인페이지로 이동
  const handleGoMain = () => {
    onBack();
  };

  const canSave = selectedInterest && selectedCompany && selectedField;

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">관심사 설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* 직업 선택 */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">직업 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {JOB_INTERESTS.map((job) => {
            const isSelected = selectedInterest === job.value;
            return (
              <div
                key={job.id}
                onClick={() => handleInterestChange(job.value)}
                className={`
                  flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  id={job.id}
                  checked={isSelected}
                  onChange={() => handleInterestChange(job.value)}
                  className="mr-3 transform scale-120"
                />
                <label
                  htmlFor={job.id}
                  className="cursor-pointer font-medium text-base"
                >
                  {job.label}
                </label>
              </div>
            );
          })}
        </div>

        {/* AI기업 선택 */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 mt-10">관심 있는 AI기업 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {AI_COMPANIES.map((company) => {
            const isSelected = selectedCompany === company.value;
            return (
              <div
                key={company.id}
                onClick={() => handleCompanyChange(company.value)}
                className={`
                  flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  id={company.id}
                  checked={isSelected}
                  onChange={() => handleCompanyChange(company.value)}
                  className="mr-3 transform scale-120"
                />
                <label
                  htmlFor={company.id}
                  className="cursor-pointer font-medium text-base"
                >
                  {company.label}
                </label>
              </div>
            );
          })}
        </div>

        {/* AI분야 ���택 */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 mt-10">관심 있는 분야 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {AI_FIELDS.map((field) => {
            const isSelected = selectedField === field.value;
            return (
              <div
                key={field.id}
                onClick={() => handleFieldChange(field.value)}
                className={`
                  flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  id={field.id}
                  checked={isSelected}
                  onChange={() => handleFieldChange(field.value)}
                  className="mr-3 transform scale-120"
                />
                <label 
                  htmlFor={field.id}
                  className="cursor-pointer font-medium text-base"
                >
                  {field.label}
                </label>
              </div>
            );
          })}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!canSave || isSubmitting}
            className={`
              flex-1 py-3 text-base font-bold rounded-lg transition-colors
              ${!canSave 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                데이터베이스에 저장 중...
              </>
            ) : (
              "데이터베이스에 저장"
            )}
          </Button>
          <Button
            onClick={handleGoMain}
            className="flex-1 py-3 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            메인페이지로 이동
          </Button>
        </div>

        {/* 메시지 */}
        {message && (
          <div
            className={`
              mt-4 p-3 rounded border text-center
              ${message.type === 'success' 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-red-100 border-red-300 text-red-800'
              }
            `}
          >
            {message.text}
          </div>
        )}

        {/* 개발자 정보 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💾 MariaDB에 실시간으로 저장됩니다
        </div>
      </div>
    </div>
  );
}
