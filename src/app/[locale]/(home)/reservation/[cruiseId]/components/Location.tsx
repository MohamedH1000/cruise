"use client";
import Dialog from "@mui/material/Dialog";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Location = ({ cruise }: any) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <h1 className="font-bold text-xl">{t("translations.location")}</h1>
      <Button onClick={handleClickOpen} className="text-sm font-bold">
        قم بعرض الموقع على الخريطة
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {t("translations.close")}
            </Button>
          </Toolbar>
        </AppBar>
        {cruise?.location?.lat ? (
          <iframe
            width="550"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            className="rounded-md  w-full h-full"
            src={`https://www.google.com/maps?q=${cruise?.location?.lat},${cruise?.location?.lng}&hl=es;z=14&output=embed`}
          ></iframe>
        ) : (
          <div className="mt-20">
            <h1 className="font-bold text-xl">
              {t("translations.noLocation")}
            </h1>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Location;
