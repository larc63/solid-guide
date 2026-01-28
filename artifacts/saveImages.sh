
# images=(root_api_prod api_container_prod)
images=(root_api api_container_prod)
for name in "${images[@]}"; do
  # Figure out which reference to save
  ref=""
  if docker image inspect "${name}:latest" >/dev/null 2>&1; then
    ref="${name}:latest"
  else
    ref="$(docker image ls --format '{{.Repository}}:{{.Tag}}' "${name}" | grep -v '<none>' | head -n1)"
  fi

  if [ -z "$ref" ]; then
    echo "ERROR: No local image found for '${name}'. Skipping." >&2
    continue
  fi

  out="${name}.tar.gz"
  echo "Saving ${ref} -> ${out}"
  if ! docker save "$ref" | gzip -c > "$out"; then
    echo "ERROR: Failed to save ${ref}." >&2
    continue
  fi

done

echo "Done."