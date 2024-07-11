import SideSectionHeader                from "../components/sideSection/sideSectionHeader"; 
import SideSectionWrapper               from "./sideSection";
import SideSectionSettingLanguageChange from "../components/sideSection/sideSectionSettingLanguageChange";
import SideSectionDarkMode              from "../components/sideSection/sideSectionDarkMode";

const SideSectionSetting = () => {

    return (
        <SideSectionWrapper>
            <SideSectionHeader titleDataLang={'stg'} icons={<></>} searchComponent={<></>} />
            <div className="w-full h-fit border-t divide-color pt-4">
                <SideSectionSettingLanguageChange />
                <SideSectionDarkMode />
            </div>
        </SideSectionWrapper>
    );
}
 
export default SideSectionSetting;