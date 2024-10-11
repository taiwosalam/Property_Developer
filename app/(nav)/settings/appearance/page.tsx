"use client";
import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import SettingsSection from "@/components/Settings/settings-section";
import {
    DirectorCard,
    SettingsOthersCheckBox,
    SettingsOthersType,
    SettingsSectionTitle,
    SettingsVerifiedBadge,
    ThemeCard,
} from "@/components/Settings/settings-components";
import TextArea from "@/components/Form/TextArea/textarea";
import Checkbox from "@/components/Form/Checkbox/checkbox";
<<<<<<< HEAD
import { website_color_schemes } from "@/components/Settings/data";
=======
>>>>>>> 541075f (Added Appearance page)

const Appearance = () => {
    const colorOptions = ['#0033C4', '#0FA7E2', '#53B07D', '#E15B0F', '#C1373F', '#050901', '#8C62FF', '#005623', '#01BA4C', '#2DD4BF', '#FFBB53', '#CE9EA1', '#C18A37', '#C1373F', '#FC63FF', '#92FF3C', '#9B00FAAB', '#377FC1'];

<<<<<<< HEAD
    const handleSelect = (value:string) => {
=======
    const handleSelect = (value: string) => {
>>>>>>> 541075f (Added Appearance page)
        console.log("Selected theme:", value);
        // Handle the selected value as needed
    };

    return (
        <>
            {/* COMPANY TYPE SETTINGS */}
            <SettingsSection title="Dashboard Themes">
                <SettingsSectionTitle
                    title="Selet Theme Template"
                    desc="Select the themes that best match your interests."
                />
                <div className="themes flex gap-5 flex-wrap">
                    <ThemeCard img="/global/theme1.svg" value="theme1" onSelect={handleSelect} />
                    <ThemeCard img="/global/theme2.svg" value="theme2" onSelect={handleSelect} />
                    <ThemeCard img="/global/theme3.svg" value="theme3" onSelect={handleSelect} />
                </div>
                <div className="flex justify-end">
                    <Button size="base_bold" className="py-[10px] px-8">
                        update
                    </Button>
                </div>
            </SettingsSection>

            {/* GRID & LIST DISPLAY SETTINGS */}
            <SettingsSection title="Grid and List Settings">
                <SettingsSectionTitle
                    title="Card Arrangement"
                    desc="Kindly select from 'grid' or 'list' to determine the appearance of your cards."
                />
                <div className="themes flex gap-5 flex-wrap">
                    <ThemeCard img="/global/grid-view.svg" value="grid" onSelect={handleSelect} />
                    <ThemeCard img="/global/list-view.svg" value="list" onSelect={handleSelect} />
                </div>
                <div className="flex justify-end">
                    <Button size="base_bold" className="py-[10px] px-8">
                        update
                    </Button>
                </div>
            </SettingsSection>

            {/* NAVBAR DISPLAY SETTINGS */}
            <SettingsSection title="Navbar Settings">
                <SettingsSectionTitle
                    title="Navbar"
                    desc="Kindly select how you want your nav bar to be like"
                />
                <div className="themes flex gap-5 flex-wrap">
                    <ThemeCard img="/global/nav1.svg" value="nav1" onSelect={handleSelect} />
                    <ThemeCard img="/global/nav2.svg" value="nav2" onSelect={handleSelect} />
                </div>
                <div className="flex justify-end">
                    <Button size="base_bold" className="py-[10px] px-8">
                        update
                    </Button>
                </div>
            </SettingsSection>

            {/* MODE - DARK/LIGHT MODE SETTINGS */}
            <SettingsSection title="Mode">
                <SettingsSectionTitle
                    title="Color scheme"
                    desc="Choose Light or Dark Mode Scheme."
                />
                <div className="themes flex gap-5 flex-wrap">
                    <ThemeCard img="/global/nav1.svg" value="light" onSelect={handleSelect} />
                    <ThemeCard img="/global/nav2.svg" value="dark" onSelect={handleSelect} />
                </div>
                <div className="flex justify-end">
                    <Button size="base_bold" className="py-[10px] px-8">
                        update
                    </Button>
                </div>
            </SettingsSection>

            {/* DASHBOARD COLOR SETTINNS */}
            <SettingsSection title="Theme and Color Settings">
                <SettingsSectionTitle
                    title="Dashboard Color Scheme"
                    desc="Customize the default color to your preference from the available options listed below."
                />
                <div className="themes flex gap-5 flex-wrap">
                    {colorOptions.map((option) => (
                        <div className={`h-[40px] w-[40px] my-2 rounded-md bg-[${option}]`} style={{ backgroundColor: option }} key={option}>
                            <label htmlFor="color">
                                <input id="color" type="button" className={`h-12`} />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="new-color flex flex-col">
                    <p className="text-sm my-4 text-text-disabled">Specify a color code or select a color that best represents your brand. You can also incorporate additional color designs based on your preferences.</p>
                    <div className="c w-[40px] h-[40px] rounded-md text-base border border-gray-300 bg-white flex items-center justify-center cursor-pointer">
                        <label htmlFor="new">
                            +
                            <input type="color" id="new" className="h-12 hidden" />
                        </label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button size="base_bold" className="py-[10px] px-8">
                        update
                    </Button>
                </div>
            </SettingsSection>

<<<<<<< HEAD
        
=======
>>>>>>> 541075f (Added Appearance page)
        </>
    );
};

export default Appearance;