import FlexCenter from "@/common/components/base/flex/FlexCenter";
import DrawerLayout from "@/modules/dash/components/DrawerLayout";

export default function Bans() {
  return (
    <DrawerLayout>
      <FlexCenter>
        <h1 className="text-2xl font-bold">Coming Soon!</h1>
        <span className="text-xl">In the meantime, manage users through the Users tab</span>
      </FlexCenter>
    </DrawerLayout>
  );
}
