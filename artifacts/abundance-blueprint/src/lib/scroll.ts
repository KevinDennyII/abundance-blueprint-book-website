export function scrollToHashOrTop(hash?: string) {
  const targetHash = hash ?? window.location.hash;

  if (targetHash) {
    const target = document.querySelector(targetHash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
