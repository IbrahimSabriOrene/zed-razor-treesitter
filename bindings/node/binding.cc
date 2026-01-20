#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_razor();

namespace {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["name"] = Napi::String::New(env, "razor");
  auto language = reinterpret_cast<uintptr_t>(tree_sitter_razor());
  exports["language"] = Napi::Number::New(env, language);
  return exports;
}

NODE_API_MODULE(tree_sitter_razor_binding, Init)

}  // namespace
