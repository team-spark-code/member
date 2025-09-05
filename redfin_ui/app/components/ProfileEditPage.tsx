// ProfileEditPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Search } from "lucide-react";

// Daum 주소 ���색 API 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

// 사용자 정보 타입 정의
type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  detailAddress?: string;
  bio?: string;
};

interface ProfileEditPageProps {
  user: User;
  onBack: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

export function ProfileEditPage({ user, onBack, onUpdateProfile }: ProfileEditPageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    zipCode: user.zipCode || "",
    address: user.address || "",
    detailAddress: user.detailAddress || "",
    bio: user.bio || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);

  // Daum 주소 검색 스크립트 로드
  useEffect(() => {
    const loadDaumPostcode = () => {
      if (window.daum && window.daum.Postcode) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Daum Postcode API'));
        document.head.appendChild(script);
      });
    };
    loadDaumPostcode().catch(err => console.error('Error loading Daum Postcode API:', err));
  }, []);

  // 주소 검색 팝업 열기
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setIsAddressSearchOpen(true);
    setTimeout(() => {
      const container = document.getElementById('addressSearchContainer');
      if (!container) {
        console.error('Address search container not found');
        setIsAddressSearchOpen(false);
        return;
      }
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          if (data.userSelectedType === 'R' && data.bname !== '' && /[동로가]$/g.test(data.bname)) {
            addr += ` (${data.bname})`;
          }
          setFormData(prev => ({ ...prev, zipCode: data.zonecode, address: addr }));
          setIsAddressSearchOpen(false);
        },
        onclose: () => setIsAddressSearchOpen(false),
        width: '100%',
        height: '100%',
      }).embed(container);
    }, 100);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "이름은 필수 항목입니다.";
    if (!formData.email.trim()) newErrors.email = "이메일은 필수 항목입니다.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "올바른 이메일 형식이 아닙니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        onBack();
        return;
      }
      const url = `${API_BASE_URL}/api/users/profile`;
      const requestBody = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        zipCode: formData.zipCode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        bio: formData.bio,
      };
      const doRequest = (method: 'PUT' | 'POST' | 'PATCH') => fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(requestBody),
      });
      let response = await doRequest('PUT');
      if (response.status === 405) {
        console.warn('PUT 405(Method Not Allowed) -> POST로 재시도');
        response = await doRequest('POST');
      }
      if (response.redirected && (response.url || '').endsWith('/login')) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
        onBack();
        return;
      }
      if (!response.ok) {
        if (response.status === 401) {
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          onBack();
          return;
        }
        if (response.status === 403) { alert('수정 권한이 없습니다.'); return; }
        if (response.status === 404) { alert('프로필 API 엔드포인트를 찾을 수 없습니다.'); return; }
        if (response.status === 405) { alert('서버가 해당 메서드를 허용하지 않습니다.'); return; }
        const errorText = await response.text();
        throw new Error(`서버 오류: ${response.status} - ${errorText}`);
      }
      const updatedUserData = await response.json();
      const updatedUser: User = { ...user, ...updatedUserData };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdateProfile(updatedUser);
      alert('프로필이 성공적으로 업데이트되었습니다!');
      onBack();
    } catch (err) {
      console.error('Profile update error:', err);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">회원정보 수정</h1>
            <p className="text-muted-foreground">프로필 정보를 수정할 수 있습니다.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">기본 정보</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  이름 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="이름을 입력하세요"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  이메일 <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="이메일을 입력하세요"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="전화번호를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  주소
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="우편번호"
                    readOnly
                  />
                  <Button type="button" onClick={handleAddressSearch} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    검색
                  </Button>
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="주소를 입력하세요"
                />
                <input
                  type="text"
                  value={formData.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="상세주소"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>취소</Button>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {isAddressSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">주소 검색</h3>
                <Button variant="ghost" onClick={() => setIsAddressSearchOpen(false)} className="p-1">✕</Button>
              </div>
              <div id="addressSearchContainer" className="w-full h-96 border rounded" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
