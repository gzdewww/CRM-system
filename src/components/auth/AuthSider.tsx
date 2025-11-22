import styles from "./AuthSider.module.scss";

export default function AuthSider() {
  return (
    <>
      <div className={styles.sider}>
        <div className={styles.sider__background} />
        <div className={styles.sider__caption}>
          <img
            src="/public/img/auth_caption.png"
            alt=""
            className={styles["sider__caption-left"]}
          />
          <img
            src="/public/img/auth_caption.png"
            alt=""
            className={styles["sider__caption-right"]}
          />
        </div>
        <img
          src="/public/img/auth_planet.png"
          alt=""
          className={styles.sider__planet}
        />
        <div className={styles.sider__circle} />
        <img
          src="/public/svg/auth_sider_centre.svg"
          alt=""
          className={styles.sider__image}
        />
        <h1 className={styles.sider__title}>Turn your ideas into reality.</h1>
        <p className={styles.sider__subtitle}>
          Start for free and get attractive offers from the community
        </p>
      </div>
    </>
  );
}
