// Import types from dependencies
import "montagespiel"
import "montagespiel/codegen/register_types.ts"
import "reload"
import "reload/codegen/register_types.ts"
import "visibility"
import "visibility/codegen/register_types.ts"

/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { SetVisibilityByTagOnClick } from "../scripts/VisibilityByTag.js";

// Register types
TypeStore.add("SetVisibilityByTagOnClick", SetVisibilityByTagOnClick);
