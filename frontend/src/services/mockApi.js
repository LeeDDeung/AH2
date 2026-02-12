// Mock API service to simulate backend prediction logic

export const predictPregnancy = async (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate prediction calculation based on some factors (mock logic)

            // Base probability
            let probability = 30;

            // Adjust based on Age
            const age = parseInt(data.age);
            if (age < 35) probability += 20;
            else if (age < 40) probability += 10;
            else probability -= 10;

            // Adjust based on procedure
            if (data.procedureType === 'IVF') probability += 15;
            else if (data.procedureType === 'IUI') probability += 5;

            // Random variation (+- 10%)
            const variation = Math.floor(Math.random() * 20) - 10;
            probability += variation;

            // Clamp between 0 and 100
            probability = Math.max(0, Math.min(100, probability));

            resolve({
                probability: probability,
                message: probability > 50 ? "임신 성공 가능성이 높습니다." : "임신 성공 가능성이 평균적입니다. 전문의와 상담하세요."
            });
        }, 1500); // 1.5s delay
    });
};
