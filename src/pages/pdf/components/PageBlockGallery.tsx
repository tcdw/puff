import React from "react";
import type { PuffFragmentProps } from "@/types/puff";
import styles from "./PageBlockGallery.module.scss";

const PageBlockGallery: React.FC<React.PropsWithChildren<PuffFragmentProps>> = ({ children }) => <div className={styles.main}>{children}</div>;

export default PageBlockGallery;
