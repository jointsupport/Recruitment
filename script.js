document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("registrationForm");

    const phoneInput =
        document.getElementById("phone");

    const emiratesIdInput =
        document.getElementById("emiratesId");

    const birthDateInput =
        document.getElementById("birthDate");

    const submitButton =
        document.querySelector(".submit-button");

    const workExperience =
        document.getElementById("workExperience");

    const experienceGroup =
        document.getElementById("experienceGroup");

    const experienceYears =
        document.getElementById("experienceYears");

    const emiratesIdAttachment =
        document.getElementById(
            "emiratesIdAttachment"
        );

    const passportAttachment =
        document.getElementById(
            "passportAttachment"
        );

    const qualificationAttachment =
        document.getElementById(
            "qualificationAttachment"
        );

    const agreementCheckbox =
        document.getElementById("agreement");

    const scriptURL =
        "https://script.google.com/macros/s/AKfycbzjyNbhCwbyN7XiMrR_BRdWz5SSsiuByjaaZdDOqP8GYPtmIBCvVt2mZKtD9jzKRf2A/exec";

    const MAX_FILE_SIZE =
        5 * 1024 * 1024;

    const ALLOWED_TYPES = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];


    /* رقم الهاتف */

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);

            }
        );

    }


    /* رقم الهوية الإماراتية */

    if (emiratesIdInput) {

        emiratesIdInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 15);

            }
        );

    }


    /* تاريخ الميلاد */

    if (
        birthDateInput &&
        typeof flatpickr !== "undefined"
    ) {

        const today =
            new Date();

        const minDate =
            new Date(
                today.getFullYear() - 30,
                today.getMonth(),
                today.getDate()
            );

        const maxDate =
            new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );

        flatpickr(
            "#birthDate",
            {
                dateFormat: "d/m/Y",
                disableMobile: true,
                minDate: minDate,
                maxDate: maxDate
            }
        );

    }


    /* إظهار وإخفاء سنوات الخبرة */

    function updateExperienceField() {

        if (
            !workExperience ||
            !experienceGroup ||
            !experienceYears
        ) {
            return;
        }

        if (
            workExperience.value === "نعم"
        ) {

            experienceGroup.style.display =
                "block";

            experienceYears.required =
                true;

        } else {

            experienceGroup.style.display =
                "none";

            experienceYears.required =
                false;

            experienceYears.value =
                "";

        }

    }


    if (workExperience) {

        workExperience.addEventListener(
            "change",
            updateExperienceField
        );

        updateExperienceField();

    }


    /* التحقق من الملف */

    function validateFile(
        file,
        label
    ) {

        if (!file) {

            throw new Error(
                "يرجى إرفاق " +
                label +
                "."
            );

        }

        if (
            !ALLOWED_TYPES.includes(
                file.type
            )
        ) {

            throw new Error(
                label +
                " يجب أن يكون بصيغة PDF أو JPG أو PNG."
            );

        }

        if (
            file.size > MAX_FILE_SIZE
        ) {

            throw new Error(
                "حجم " +
                label +
                " يتجاوز 5 ميجابايت."
            );

        }

    }


    /* تحويل الملف إلى Base64 */

    function fileToDataURL(file) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                const reader =
                    new FileReader();

                reader.onload =
                    function () {

                        resolve(
                            reader.result
                        );

                    };

                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "تعذر قراءة الملف: " +
                                file.name
                            )
                        );

                    };

                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* إرسال النموذج */

    if (form) {

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();
                    return;

                }

                if (!submitButton) {
                    return;
                }

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "جاري رفع المرفقات...";

                try {

                    if (
                        !emiratesIdAttachment ||
                        !passportAttachment ||
                        !qualificationAttachment
                    ) {

                        throw new Error(
                            "تعذر العثور على خانات المرفقات."
                        );

                    }

                    const emiratesIdFile =
                        emiratesIdAttachment.files[0];

                    const passportFile =
                        passportAttachment.files[0];

                    const qualificationFile =
                        qualificationAttachment.files[0];


                    validateFile(
                        emiratesIdFile,
                        "الهوية الإماراتية"
                    );

                    validateFile(
                        passportFile,
                        "جواز السفر"
                    );

                    validateFile(
                        qualificationFile,
                        "المؤهل العلمي"
                    );


                    const [
                        emiratesIdData,
                        passportData,
                        qualificationData
                    ] = await Promise.all([

                        fileToDataURL(
                            emiratesIdFile
                        ),

                        fileToDataURL(
                            passportFile
                        ),

                        fileToDataURL(
                            qualificationFile
                        )

                    ]);


                    submitButton.textContent =
                        "جاري إرسال الطلب...";


                    const formData =
                        new FormData(form);


                    /*
                      حذف الملفات الأصلية
                      لأنها سترسل بصيغة Base64
                    */

                    formData.delete(
                        "emiratesIdAttachment"
                    );

                    formData.delete(
                        "passportAttachment"
                    );

                    formData.delete(
                        "qualificationAttachment"
                    );


                    /* الإقرار */

                    formData.set(
                        "agreement",
                        agreementCheckbox &&
                        agreementCheckbox.checked
                            ? "موافق"
                            : "غير موافق"
                    );


                    /* سنوات الخبرة */

                    if (
                        !workExperience ||
                        workExperience.value !== "نعم"
                    ) {

                        formData.set(
                            "experienceYears",
                            ""
                        );

                    }


                    /* بيانات الهوية */

                    formData.set(
                        "emiratesIdAttachmentData",
                        emiratesIdData
                    );

                    formData.set(
                        "emiratesIdAttachmentName",
                        emiratesIdFile.name
                    );


                    /* بيانات الجواز */

                    formData.set(
                        "passportAttachmentData",
                        passportData
                    );

                    formData.set(
                        "passportAttachmentName",
                        passportFile.name
                    );


                    /* بيانات المؤهل */

                    formData.set(
                        "qualificationAttachmentData",
                        qualificationData
                    );

                    formData.set(
                        "qualificationAttachmentName",
                        qualificationFile.name
                    );


                    /*
                      إرسال البيانات إلى Google Apps Script
                    */

                    await fetch(
                        scriptURL,
                        {
                            method: "POST",
                            body: formData,
                            mode: "no-cors"
                        }
                    );


                    alert(
                        "تم إرسال الطلب والمرفقات بنجاح."
                    );


                    form.reset();


                    if (
                        birthDateInput &&
                        birthDateInput._flatpickr
                    ) {

                        birthDateInput
                            ._flatpickr
                            .clear();

                    }


                    updateExperienceField();


                } catch (error) {

                    console.error(
                        "حدث خطأ أثناء الإرسال:",
                        error
                    );

                    alert(
                        error.message ||
                        "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى."
                    );

                } finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "إرسال الطلب";

                }

            }
        );

    }

});