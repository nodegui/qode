// Copyright 2019 Atul R. All rights reserved.
#pragma once

#include <memory>
#include <QApplication>

namespace qode {
    extern QApplication* qtAppInstance;
    int Start(int argc, char* argv[]);
}  // namespace qode
