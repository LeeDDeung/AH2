import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { User, Stethoscope, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';

const RoleSelectionPage: React.FC = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    // Reset auth state when entering role selection
    React.useEffect(() => {
        logout();
    }, []);

    const handleRoleSelect = (role: UserRole) => {
        login(role);
        // Navigate based on role to their specific dashboard
        if (role === 'PATIENT') navigate('/patient');
        else if (role === 'DOCTOR') navigate('/doctor');
        else if (role === 'PLANNER') navigate('/planner');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EB] p-6">
            <div className="mb-12 text-center max-w-2xl">
                <h1 className="mb-4 text-4xl font-serif font-bold text-[#554236]">OpenAH 로그인</h1>
                <p className="text-[#7D6049] text-lg">
                    서비스 이용을 위해 해당하는 역할을 선택해주세요.<br />
                    각 역할에 맞는 전용 대시보드로 이동합니다.
                </p>
            </div>

            <div className="grid w-full max-w-6xl gap-8 md:grid-cols-3">
                {/* Patient / User Card */}
                <Card
                    className="group relative overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl active:scale-95 active:border-[#7D6049] border-[#EAE4D6] bg-white h-full"
                    onClick={() => handleRoleSelect('PATIENT')}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#967659]" />
                    <CardHeader className="items-center pb-6 pt-10">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F4F8F4] text-[#4D884D] group-hover:bg-[#E3EFE3] transition-colors">
                            <User className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-[#4D884D]">사용자 (Patient)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-10">
                        <p className="text-[#68503E] leading-relaxed">
                            난임 시술 기록부터 임신 성공 예측까지.<br />
                            <span className="font-semibold">나만의 여정</span>을 시작하세요.
                        </p>
                        <Button className="mt-8 w-full bg-[#4D884D] hover:bg-[#3A6d3A] text-white">
                            사용자 로그인
                        </Button>
                    </CardContent>
                </Card>

                {/* Doctor / Medical Card */}
                <Card
                    className="group relative overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl active:scale-95 active:border-[#7D6049] border-[#EAE4D6] bg-white h-full"
                    onClick={() => handleRoleSelect('DOCTOR')}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#554236]" />
                    <CardHeader className="items-center pb-6 pt-10">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F2EB] text-[#7D6049] group-hover:bg-[#EAE4D6] transition-colors">
                            <Stethoscope className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-[#7D6049]">의료진 (Medical)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-10">
                        <p className="text-[#68503E] leading-relaxed">
                            환자의 임상 데이터를 분석하고<br />
                            <span className="font-semibold">최적의 시술 방향</span>을 설정하세요.
                        </p>
                        <Button className="mt-8 w-full bg-[#7D6049] hover:bg-[#68503E] text-white">
                            의료진 로그인
                        </Button>
                    </CardContent>
                </Card>

                {/* Planner Card */}
                <Card
                    className="group relative overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl active:scale-95 active:border-[#7D6049] border-[#EAE4D6] bg-white h-full"
                    onClick={() => handleRoleSelect('PLANNER')}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-400" />
                    <CardHeader className="items-center pb-6 pt-10">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-600 group-hover:bg-gray-100 transition-colors">
                            <Shield className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-700">설계사 (Planner)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-10">
                        <p className="text-[#68503E] leading-relaxed">
                            고객의 리스크를 정밀 진단하고<br />
                            <span className="font-semibold">맞춤형 보장 플랜</span>을 제안하세요.
                        </p>
                        <Button className="mt-8 w-full bg-gray-600 hover:bg-gray-700 text-white">
                            설계사 로그인
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
