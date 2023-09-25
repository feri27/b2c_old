import BlankPage from '@/components/common/BlankPage';

export default function Home({
  searchParams,
}: {
  searchParams: {
    dbtragt: string;
    endtoendid: string;
    endtoendsignature: string;
  };
}) {
  return (
    <BlankPage
      dbtrAgt={searchParams.dbtragt}
      endToEndId={searchParams.endtoendid}
      endToEndIdSignature={
        searchParams.endtoendsignature ??
        decodeURIComponent(searchParams.endtoendsignature)
      }
    />
  );
}
