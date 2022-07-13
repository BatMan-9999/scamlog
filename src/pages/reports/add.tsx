import useDebounce from "@/common/hooks/useDebounce";
import urlRegex from "@/common/utilities/regex/url";
import AuthenticatedOnly from "@/modules/auth/components/wrappers/AuthenticatedOnly";
import ReportServersInviteCard from "@/modules/reports/components/ReportServersInviteCard";
import { Prisma, ServerType } from "@prisma/client";
import { APIInvite, GuildVerificationLevel } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function Report() {
  const [invite, setInvite] = useState("");
  const [longReport, setLongReport] = useState("");
  const [adminIds, setAdminIds] = useState<string[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState<string[]>([]);
  const [currentEvidenceLink, setCurrentEvidenceLink] = useState("");
  const [serverType, setServerType] =
    useState<Prisma.ScamServerCreateInput["serverType"]>("QR");
  const [nsfw, setNSFW] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const debouncedInvite = useDebounce(invite, 800);

  const inviteQuery = useQuery(
    ["discordserver", debouncedInvite],
    (): Promise<APIInvite> =>
      fetch(
        `https://discord.com/api/v10/invites/${debouncedInvite}?with_counts=true&with_expiration=true`
      ).then((res) => res.json()),
    {
      enabled: !!debouncedInvite,
      refetchOnWindowFocus: false,
      refetchInterval: 120_000, // 2min
      staleTime: 60_000, // 1min
      refetchOnMount: true,
    }
  );

  const reportcheckQuery = useQuery(
    ["reportServerId", inviteQuery.data?.guild?.id],
    () =>
      fetch(`/api/v1/reports?serverId=${inviteQuery.data?.guild?.id}`).then(
        (res) => res.json()
      )
  );

  const checkQuery = useQuery(["serverId", inviteQuery.data?.guild?.id], () =>
    fetch(`/api/v1/servers?serverId=${inviteQuery.data?.guild?.id}`).then(
      (res) => res.json()
    )
  );

  useEffect(() => {
    if (
      checkQuery.data?.data?.servers?.length ||
      reportcheckQuery.data?.data?.reports?.length
    ) {
      return setIsDuplicated(true);
    }
    return setIsDuplicated(false);
  }, [checkQuery.data?.data?.servers, reportcheckQuery.data?.data?.reports]);

  useEffect(() => {
    if (isDuplicated)
      toast(`Server is already in database`, {
        type: "error",
      });
  }, [isDuplicated]);

  return (
    <AuthenticatedOnly>
      <div className="flex flex-col justify-center items-center rounded-md">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="form-control mx-4 px-4 py-5 bg-white bg-opacity-5 mb-4"
        >
          <div className="w-full py-2">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Report a Server</h2>
              <span>
                False reports are <span className="text-error">bannable</span>.
                All reports reviewed by trained staff.
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            <div className="">
              <label className="label">
                <span className="label-text">Server Invite</span>
              </label>
              <label className="input-group">
                <span>discord.gg/</span>
                <input
                  type="text"
                  value={invite}
                  onChange={(e) => setInvite(e.target.value)}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Scam Type</span>
                <span className="label-text-alt">
                  {serverType === "OTHER"
                    ? "Specify the type of server in the description"
                    : null}
                </span>
              </label>

              <select
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setServerType(e.target.value as ServerType)}
                value={serverType}
              >
                <option selected disabled>
                  Select a type
                </option>
                <option value="QR">QR</option>
                <option value="FAKENITRO">Fake Nitro</option>
                <option value="OAUTH">OAuth/Forced Join</option>
                <option value="VIRUS">Malware &amp; Viruses</option>
                <option value="NSFW">Nudes &amp; NSFW Scams</option>
                <option value="SPAM">Mass DMs, Spam &amp; Ads</option>
                <option value="OTHER">Other...</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Owner Or Admin IDs</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={currentAdminId}
                  onChange={(e) => setCurrentAdminId(e.target.value)}
                />
                <button
                  className="btn btn-square btn-primary"
                  type="button"
                  disabled={!currentAdminId}
                  onClick={() => {
                    if (adminIds.includes(currentAdminId))
                      return toast("ID already added", {
                        type: "error",
                      });
                    setAdminIds([...adminIds, currentAdminId]);
                    setCurrentAdminId("");
                  }}
                >
                  <Plus />
                </button>
              </div>
              <div className="flex flex-col justify-center items-center">
                {adminIds.map((id) => (
                  <div key={id} className="relative border p-2 mt-2">
                    <div
                      className="rounded-full hover:bg-red-500 transition-colors bg-error absolute -top-3 -right-3"
                      onClick={() => {
                        setAdminIds(adminIds.filter((i) => i !== id));
                      }}
                    >
                      <X height={20} width={20} />
                    </div>
                    <pre className="">{id}</pre>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Evidence Links</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="https://example.com"
                  onChange={(e) => setCurrentEvidenceLink(e.target.value)}
                  value={currentEvidenceLink}
                />
                <button
                  className="btn btn-square btn-primary"
                  type="button"
                  disabled={!currentEvidenceLink}
                  onClick={() => {
                    if (evidenceLinks.includes(currentEvidenceLink))
                      return toast("Link already added", {
                        type: "error",
                      });
                    if (!urlRegex.test(currentEvidenceLink))
                      return toast("Invalid URL", {
                        type: "error",
                      });
                    setEvidenceLinks([...evidenceLinks, currentEvidenceLink]);
                    setCurrentEvidenceLink("");
                  }}
                >
                  <Plus />
                </button>
              </div>
              <div className="flex flex-col justify-center items-center">
                {evidenceLinks.map((link) => (
                  <div key={link} className="relative border p-2 mt-2">
                    <div
                      className="rounded-full hover:bg-red-500 transition-colors bg-error absolute -top-3 -right-3"
                      onClick={() => {
                        setEvidenceLinks(
                          evidenceLinks.filter((i) => i !== link)
                        );
                      }}
                    >
                      <X height={20} width={20} />
                    </div>
                    <a
                      href={link}
                      rel="noreferrer"
                      target={"_blank"}
                      className="link"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Description of Scam</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-36 w-full"
              placeholder="Please add lots of detail."
            />
          </div>
          <div className="mt-4 w-full">
            <label className="label cursor-pointer">
              <span className="label-text">Not Safe For Work (NSFW)</span>
              <input
                type="checkbox"
                className="checkbox"
                defaultChecked={false}
                onChange={(e) => setNSFW(e.target.checked)}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 mx-2 gap-4">
            <div className="lg:col-span-2 w-full">
              <button
                className="btn btn-primary w-full"
                type="button"
                onClick={() => {
                  // Form submisson logic

                  const promise = fetch(`/api/v1/reports/new`, {
                    credentials: "include",
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      inviteCodes: [invite],
                      serverType,
                      longReport,
                      adminIds,
                      nsfw,
                      evidenceLinks
                    }),
                  });

                  // Cleanup form
                  setAdminIds([]);
                  setEvidenceLinks([]);
                  setInvite("");
                }}
              >
                Submit
              </button>
            </div>
            <div className="w-full">
              <button
                className="btn btn-error w-full"
                type="reset"
                onClick={() => {
                  setAdminIds([]);
                  setEvidenceLinks([]);
                  setInvite("");
                }}
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
        <div>
          {inviteQuery.data?.guild ? (
            <ReportServersInviteCard invite={inviteQuery.data} />
          ) : null}
          {debouncedInvite && !inviteQuery.data?.guild ? (
            <div>
              <span className="text-center font-semibold">
                Server not found. The invite might be expired.
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </AuthenticatedOnly>
  );
}
