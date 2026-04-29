import { type JSX, type SubmitEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { IkasketaMaila } from "@/common/types/entities";

import apiClient from "@/common/apiClient";
import { handleApiError } from "@/common/errorHelper";
import { MAILAK } from "@/common/types/entities";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateEducationForm } from "@/hooks/useUpdateEducationForm";
import { useUpdatePasswordForm } from "@/hooks/useUpdatePasswordForm";
import { useUpdatePersonalDataForm } from "@/hooks/useUpdatePersonalDataForm";

interface GetProfileResponse {
    data?: {
        profile: {
            helbide_elektronikoa: string;
            ikaslea: null | {
                gogoko_lengoaia: null | {
                    bertsioa: string;
                    izena: string;
                    programazio_lengoaia_id: number;
                };
                ikasketa_maila: IkasketaMaila;
                nire_mailakoak_ikusi: boolean;
            };
            izena: string;
        };
    };
    error?: string;
    success: boolean;
}

interface GetProgrammingLanguagesResponse {
    data?: {
        bertsioa: string;
        izena: string;
        programazio_lengoaia_id: number;
    }[];
    error?: string;
    success: boolean;
}

type ProgrammingLanguageOption = {
    label: string;
    value: string;
};

interface UpdateEducationResponse {
    data?: {
        updatedData: {
            gogoko_lengoaia: number | undefined;
            ikasketa_maila: IkasketaMaila | undefined;
            nire_mailakoak_ikusi: boolean | undefined;
        };
    };
    error?: string;
    issues?: {
        message: string;
        path: string;
    }[];
    success: boolean;
}

interface UpdatePasswordResponse {
    data?: {
        message: string;
    };
    error?: string;
    issues?: {
        message: string;
        path: string;
    }[];
    success: boolean;
}

interface UpdatePersonalDataResponse {
    data?: {
        izena: string;
    };
    error?: string;
    issues?: {
        message: string;
        path: string;
    }[];
    success: boolean;
}

const ERROR_GENERIC_FETCH = "Akats bat gertatu da profila eskuratzean";
const ERROR_GENERIC_UPDATE = "Akats bat gertatu da datuak eguneratzean";
const NO_PREFERRED_LANGUAGE_VALUE = "none";

function UserProfile(): JSX.Element {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profileName, setProfileName] = useState<string>("");
    const [programmingLanguageOptions, setProgrammingLanguageOptions] =
        useState<ProgrammingLanguageOption[]>([]);

    const {
        clearUpdatePersonalDataError,
        email,
        handleNameBlur,
        name,
        setEmail,
        setName,
        setUpdatePersonalDataErrors,
        updatePersonalDataErrors,
        validateUpdatePersonalData,
    } = useUpdatePersonalDataForm();

    const {
        clearUpdatePasswordError,
        confirmPassword,
        handleConfirmPasswordBlur,
        handleNewPasswordBlur,
        handleOldPasswordBlur,
        newPassword,
        oldPassword,
        setConfirmPassword,
        setNewPassword,
        setOldPassword,
        setUpdatePasswordErrors,
        updatePasswordErrors,
        validateUpdatePassword,
    } = useUpdatePasswordForm();

    const {
        clearUpdateEducationError,
        educationLevel,
        preferredProgrammingLanguage,
        setEducationLevel,
        setPreferredProgrammingLanguage,
        setShowMySameLevel,
        setUpdateEducationErrors,
        showMySameLevel,
        updateEducationErrors,
        validateUpdateEducation,
    } = useUpdateEducationForm();

    useEffect(() => {
        const fetchProfile = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const [profileRes, languagesRes] = await Promise.all([
                    apiClient.get<GetProfileResponse>("/users/profile"),
                    apiClient.get<GetProgrammingLanguagesResponse>(
                        "/exercises/programming-languages",
                    ),
                ]);

                if (!profileRes.data.success) {
                    toast.error(profileRes.data.error || ERROR_GENERIC_FETCH);
                    return;
                }
                if (!languagesRes.data.success) {
                    toast.error(languagesRes.data.error || ERROR_GENERIC_FETCH);
                    return;
                }

                const profile = profileRes.data.data?.profile;
                const programmingLanguages = languagesRes.data.data || [];

                setEmail(profile?.helbide_elektronikoa || "");
                setName(profile?.izena || "");
                setProfileName(profile?.izena || "");
                setEducationLevel(profile?.ikaslea?.ikasketa_maila || "");
                setShowMySameLevel(
                    profile?.ikaslea?.nire_mailakoak_ikusi || false,
                );

                setProgrammingLanguageOptions([
                    {
                        label: "Gogoko lengoaiarik ez dut",
                        value: NO_PREFERRED_LANGUAGE_VALUE,
                    },
                    ...programmingLanguages.map((lang) => ({
                        label: `${lang.izena} (${lang.bertsioa})`,
                        value: String(lang.programazio_lengoaia_id),
                    })),
                ]);

                const preferredProgrammingLanguageId =
                    profile?.ikaslea?.gogoko_lengoaia?.programazio_lengoaia_id;
                setPreferredProgrammingLanguage(
                    preferredProgrammingLanguageId
                        ? String(preferredProgrammingLanguageId)
                        : NO_PREFERRED_LANGUAGE_VALUE,
                );
            } catch (err: unknown) {
                toast.error(handleApiError(err, ERROR_GENERIC_FETCH).general);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [
        setEmail,
        setName,
        setEducationLevel,
        setShowMySameLevel,
        setPreferredProgrammingLanguage,
    ]);

    async function handleUpdatePersonalData(
        e: SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        e.preventDefault();
        if (!validateUpdatePersonalData()) {
            return;
        }

        setIsLoading(true);
        setUpdatePersonalDataErrors({});

        try {
            const response = await apiClient.put<UpdatePersonalDataResponse>(
                "/users/account",
                {
                    izena: name,
                },
            );
            if (!response.data.success) {
                setUpdatePersonalDataErrors({
                    general: response.data.error || ERROR_GENERIC_UPDATE,
                });
                return;
            }
            toast.success("Datuak eguneratu dira");
            const updatedName = response.data.data?.izena || name;
            setName(updatedName);
            setProfileName(updatedName);
        } catch (err: unknown) {
            setUpdatePersonalDataErrors(
                handleApiError(err, ERROR_GENERIC_UPDATE),
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdatePassword(
        e: SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        e.preventDefault();
        if (!validateUpdatePassword()) {
            return;
        }

        setIsLoading(true);
        setUpdatePasswordErrors({});

        try {
            const response = await apiClient.put<UpdatePasswordResponse>(
                "/users/password",
                {
                    pasahitza_berria: newPassword,
                    pasahitza_errepikatu: confirmPassword,
                    pasahitza_zaharra: oldPassword,
                },
            );
            if (!response.data.success) {
                setUpdatePasswordErrors({
                    general: response.data.error || ERROR_GENERIC_UPDATE,
                });
                return;
            }
            toast.success(
                response.data.data?.message || "Pasahitza eguneratu da",
            );
            setToken(null);
            navigate("/login", { replace: true });
        } catch (err: unknown) {
            setUpdatePasswordErrors(handleApiError(err, ERROR_GENERIC_UPDATE));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateEducation(
        e: SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        e.preventDefault();
        if (!validateUpdateEducation()) {
            return;
        }

        setIsLoading(true);
        setUpdateEducationErrors({});

        try {
            const response = await apiClient.put<UpdateEducationResponse>(
                "/users/education",
                {
                    gogoko_lengoaia:
                        preferredProgrammingLanguage ===
                        NO_PREFERRED_LANGUAGE_VALUE
                            ? null
                            : Number(preferredProgrammingLanguage),
                    ikasketa_maila: educationLevel,
                    nire_mailakoak_ikusi: showMySameLevel,
                },
            );
            if (!response.data.success) {
                setUpdateEducationErrors({
                    general: response.data.error || ERROR_GENERIC_UPDATE,
                });
                return;
            }
            toast.success("Datuak eguneratu dira");
        } catch (err: unknown) {
            setUpdateEducationErrors(handleApiError(err, ERROR_GENERIC_UPDATE));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto h-full max-w-6xl">
            <div className="mx-12 h-full divide-y divide-slate-400 bg-slate-200 px-6 py-8 [&_form]:mt-6 [&_form]:space-y-4 [&_form]:pb-6 [&_h2]:text-xl [&_h2]:font-semibold">
                <h1 className="pb-4 text-2xl font-semibold">
                    Ongi etorri,{" "}
                    <span className="font-bold text-amber-600">
                        {profileName}
                    </span>
                    !
                </h1>

                <form noValidate onSubmit={handleUpdatePersonalData}>
                    <h2>Erabiltzailea aldatu</h2>
                    <Input
                        autoComplete="email"
                        disabled
                        inputMode="email"
                        label="Helbide elektronikoa"
                        readOnly
                        required
                        type="email"
                        value={email}
                    />
                    <Input
                        autoComplete="name"
                        disabled={isLoading}
                        error={updatePersonalDataErrors.izena}
                        inputMode="text"
                        label="Izena"
                        onBlur={handleNameBlur}
                        onChange={(e) => {
                            setName(e.target.value);
                            clearUpdatePersonalDataError("izena");
                        }}
                        required
                        type="text"
                        value={name}
                    />

                    <FormError message={updatePersonalDataErrors.general} />

                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Button
                            className="sm:w-auto sm:px-12"
                            isLoading={isLoading}
                            type="submit"
                            variant="primary"
                        >
                            Eguneratu
                        </Button>
                    </div>
                </form>

                <form noValidate onSubmit={handleUpdatePassword}>
                    <h2>Pasahitza eguneratu</h2>
                    <Input
                        autoComplete="current-password"
                        disabled={isLoading}
                        error={updatePasswordErrors.pasahitza_zaharra}
                        inputMode="text"
                        label="Pasahitza zaharra"
                        onBlur={handleOldPasswordBlur}
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                            clearUpdatePasswordError("pasahitza_zaharra");
                        }}
                        required
                        type="password"
                        value={oldPassword}
                    />
                    <Input
                        autoComplete="new-password"
                        disabled={isLoading}
                        error={updatePasswordErrors.pasahitza_berria}
                        inputMode="text"
                        label="Pasahitza berria"
                        onBlur={handleNewPasswordBlur}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            clearUpdatePasswordError("pasahitza_berria");
                        }}
                        required
                        type="password"
                        value={newPassword}
                    />
                    <Input
                        autoComplete="new-password"
                        disabled={isLoading}
                        error={updatePasswordErrors.pasahitza_errepikatu}
                        inputMode="text"
                        label="Pasahitza errepikatu"
                        onBlur={handleConfirmPasswordBlur}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearUpdatePasswordError("pasahitza_errepikatu");
                        }}
                        required
                        type="password"
                        value={confirmPassword}
                    />

                    <FormError message={updatePasswordErrors.general} />

                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Button
                            className="sm:w-auto sm:px-12"
                            isLoading={isLoading}
                            type="submit"
                            variant="primary"
                        >
                            Eguneratu
                        </Button>
                    </div>
                </form>

                <form noValidate onSubmit={handleUpdateEducation}>
                    <h2>Ikasketa maila aldatu</h2>
                    <Select
                        disabled={isLoading}
                        error={updateEducationErrors.ikasketa_maila}
                        label="Ikasketa maila"
                        onChange={(value) => {
                            setEducationLevel(value);
                            clearUpdateEducationError("ikasketa_maila");
                        }}
                        options={MAILAK}
                        value={educationLevel}
                    />
                    <Input
                        autoComplete="off"
                        checked={showMySameLevel}
                        className="w-auto! self-start"
                        disabled={isLoading}
                        error={updateEducationErrors.nire_mailakoak_ikusi}
                        inputMode="none"
                        label="Nire mailakoak ikusi?"
                        onChange={(e) => {
                            setShowMySameLevel(e.target.checked);
                            clearUpdateEducationError("nire_mailakoak_ikusi");
                        }}
                        type="checkbox"
                    />
                    <Select
                        disabled={isLoading}
                        error={updateEducationErrors.gogoko_lengoaia}
                        label="Gogoko lengoaia"
                        onChange={(value) => {
                            setPreferredProgrammingLanguage(value);
                            clearUpdateEducationError("gogoko_lengoaia");
                        }}
                        options={programmingLanguageOptions}
                        value={preferredProgrammingLanguage}
                    />

                    <FormError message={updateEducationErrors.general} />

                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Button
                            className="sm:w-auto sm:px-12"
                            isLoading={isLoading}
                            type="submit"
                            variant="primary"
                        >
                            Eguneratu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
